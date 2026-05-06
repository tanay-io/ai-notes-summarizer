import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mammoth from "mammoth";
import { createWorker } from "tesseract.js";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";
import fs from "node:fs";
import path from "node:path";

import { connectToDatabase } from "@/lib/mongodb";
import Generation, { GenerationType } from "@/models/generation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authoptions";

const sanitizeEnv = (value?: string) =>
  String(value || "")
    .replace(/^\s*"|"\s*$/g, "")
    .trim();

type ResolvedEnv = {
  value: string;
  source: ".env.local" | ".env" | "process.env" | "unset";
};

function readEnvVarFromFile(
  fileName: ".env.local" | ".env",
  varName: string,
): string {
  try {
    const fullPath = path.join(process.cwd(), fileName);
    if (!fs.existsSync(fullPath)) return "";

    const content = fs.readFileSync(fullPath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const equalIndex = trimmed.indexOf("=");
      if (equalIndex < 0) continue;

      const key = trimmed.slice(0, equalIndex).trim();
      if (key !== varName) continue;

      const rawValue = trimmed.slice(equalIndex + 1).trim();
      return sanitizeEnv(rawValue);
    }
    return "";
  } catch {
    return "";
  }
}

function resolveEnv(varName: string): ResolvedEnv {
  const fromLocal = readEnvVarFromFile(".env.local", varName);
  if (fromLocal) return { value: fromLocal, source: ".env.local" };

  const fromEnv = readEnvVarFromFile(".env", varName);
  if (fromEnv) return { value: fromEnv, source: ".env" };

  const fromProcess = sanitizeEnv(process.env[varName]);
  if (fromProcess) return { value: fromProcess, source: "process.env" };

  return { value: "", source: "unset" };
}

async function parsePdf(fileBuffer: Buffer): Promise<string> {
  try {
    const pdfParse = await import("pdf-parse");
    const data = await pdfParse.default(fileBuffer);
    return data.text;
  } catch (error) {
    console.error("Error parsing PDF with pdf-parse:", error);
    try {
      const textContent = await extractPdfTextFallback(fileBuffer);
      return textContent;
    } catch (fallbackError) {
      console.error("Fallback PDF parsing also failed:", fallbackError);
      throw new Error(
        "Failed to parse PDF file. Please ensure it contains selectable text or try uploading as images.",
      );
    }
  }
}

async function extractPdfTextFallback(fileBuffer: Buffer): Promise<string> {
  const text = fileBuffer.toString("utf8");
  const cleanedText = text
    .replace(/[^\x20-\x7E\n\r\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (cleanedText.length < 50) {
    throw new Error("Could not extract meaningful text from PDF");
  }
  return cleanedText;
}

async function parseDocx(fileBuffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  } catch (error) {
    console.error("Error parsing DOCX:", error);
    throw new Error("Failed to parse DOCX file.");
  }
}

async function performOcr(imageBuffer: Buffer): Promise<string> {
  const worker = await createWorker("eng");
  try {
    const {
      data: { text },
    } = await worker.recognize(imageBuffer);
    return text;
  } finally {
    await worker.terminate();
  }
}

async function generateContentWithAI(
  text: string,
  type: GenerationType,
): Promise<string> {
  const normalizeModelId = (value: string): string => {
    const trimmed = value.replace(/^\s*"|"\s*$/g, "").trim();
    const normalized = trimmed.toLowerCase().replace(/\s+/g, " ").trim();

    const aliases: Record<string, string> = {
      "gemini 2.5 flash": "gemini-2.5-flash",
      "gemini 2.5 pro": "gemini-2.5-pro",
      "gemini 1.5 flash": "gemini-1.5-flash",
      "gemini 1.5 pro": "gemini-1.5-pro",
    };

    if (aliases[normalized]) {
      return aliases[normalized];
    }

    return normalized
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Prefer .env.local/.env values to avoid stale shell-level env overrides.
  const geminiApiKeyResolved = resolveEnv("GEMINI_API_KEY");
  const googleApiKeyResolved = resolveEnv("GOOGLE_API_KEY");

  const geminiApiKey = geminiApiKeyResolved.value;
  const googleApiKey = googleApiKeyResolved.value;

  const primaryApiKey = geminiApiKey || googleApiKey;
  const fallbackApiKey =
    geminiApiKey && googleApiKey && geminiApiKey !== googleApiKey
      ? googleApiKey
      : "";

  const primarySource = geminiApiKey
    ? `GEMINI_API_KEY(${geminiApiKeyResolved.source})`
    : `GOOGLE_API_KEY(${googleApiKeyResolved.source})`;

  const mask = (value: string) => (value ? `****${value.slice(-4)}` : "unset");
  console.log(
    "AI key selection:",
    `gemini=${mask(geminiApiKey)} from ${geminiApiKeyResolved.source};`,
    `google=${mask(googleApiKey)} from ${googleApiKeyResolved.source};`,
    `using=${primarySource}`,
  );

  if (!primaryApiKey) {
    throw new Error(
      "AI API key not configured. Set GOOGLE_API_KEY or GEMINI_API_KEY in your environment.",
    );
  }

  const generativeModelResolved = resolveEnv("GENERATIVE_MODEL");
  const geminiModelResolved = resolveEnv("GEMINI_MODEL");
  const rawModelId =
    generativeModelResolved.value ||
    geminiModelResolved.value ||
    "gemini-2.5-flash";
  const modelId = normalizeModelId(String(rawModelId));
  const modelSource = generativeModelResolved.value
    ? `GENERATIVE_MODEL(${generativeModelResolved.source})`
    : geminiModelResolved.value
      ? `GEMINI_MODEL(${geminiModelResolved.source})`
      : "default";
  console.log("AI model id:", modelId, `source=${modelSource}`);

  let prompt: string;

  switch (type) {
    case GenerationType.SUMMARY:
      prompt = `Please summarize the following text. Keep the summary concise and focused on the main points:\n\n${text}`;
      break;
    case GenerationType.FLASHCARDS:
      prompt = `Generate flashcards from the following text. Each flashcard should have a question on one line and the answer on the next. Separate flashcards with a blank line. Example: "Q: What is A?\nA: B."\n\n${text}`;
      break;
    case GenerationType.KEY_POINTS:
      prompt = `Extract 5 to 6 key points from the following text. Present them as a bulleted list. Each point should be concise. Do not include anything else other than the bulleted list.\n\n${text}`;
      break;
    default:
      throw new Error("Invalid generation type.");
  }

  const generateWithKey = async (apiKey: string) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelId });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  };

  const sleep = (ms: number) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  const isTransientModelBusyError = (errorText: string) =>
    /\[503 Service Unavailable\]|currently experiencing high demand|spikes in demand|try again later/i.test(
      errorText,
    );

  const generateWithRetry = async (apiKey: string) => {
    const delaysMs = [0, 600, 1400];
    let lastError: unknown = null;

    for (let attempt = 0; attempt < delaysMs.length; attempt++) {
      if (delaysMs[attempt] > 0) {
        await sleep(delaysMs[attempt]);
      }

      try {
        return await generateWithKey(apiKey);
      } catch (error) {
        const errorText = error instanceof Error ? error.message : String(error);
        lastError = error;

        if (isTransientModelBusyError(errorText) && attempt < delaysMs.length - 1) {
          console.warn(
            `AI model busy, retrying attempt ${attempt + 2}/${delaysMs.length}...`,
          );
          continue;
        }

        throw error;
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new Error(String(lastError));
  };

  try {
    return await generateWithRetry(primaryApiKey);
  } catch (error) {
    console.error("AI generation error:", error);

    const errorText = error instanceof Error ? error.message : String(error);
    if (
      /API_KEY_INVALID|API Key not found/i.test(errorText) &&
      fallbackApiKey
    ) {
      try {
        console.warn(
          "Primary API key rejected; retrying with alternate configured key.",
        );
        return await generateWithRetry(fallbackApiKey);
      } catch (retryError) {
        const retryText =
          retryError instanceof Error ? retryError.message : String(retryError);
        if (isTransientModelBusyError(retryText)) {
          throw new Error(
            "AI_MODEL_BUSY: Gemini model is temporarily overloaded due to high demand. Please retry shortly.",
          );
        }
        if (/API_KEY_INVALID|API Key not found/i.test(retryText)) {
          throw new Error(
            "AI_API_KEY_INVALID: The configured Gemini API key is invalid, revoked, or restricted for this project.",
          );
        }
        throw new Error(`AI generation failed: ${retryText}`);
      }
    }

    if (/API_KEY_INVALID|API Key not found/i.test(errorText)) {
      throw new Error(
        "AI_API_KEY_INVALID: The configured Gemini API key is invalid, revoked, or restricted for this project.",
      );
    }

    if (isTransientModelBusyError(errorText)) {
      throw new Error(
        "AI_MODEL_BUSY: Gemini model is temporarily overloaded due to high demand. Please retry shortly.",
      );
    }

    if (
      /unexpected model name format|GenerateContentRequest\.model/i.test(errorText)
    ) {
      throw new Error(
        "AI_MODEL_INVALID: Invalid model id format. Use model ids like gemini-2.5-flash.",
      );
    }

    throw new Error(`AI generation failed: ${errorText}`);
  }
}

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const generationType = formData.get("generationType") as GenerationType;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          message: `File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB. Please upload a smaller file.`,
        },
        { status: 413 },
      );
    }

    if (!Object.values(GenerationType).includes(generationType)) {
      return NextResponse.json(
        { message: "Invalid generation type selected." },
        { status: 400 },
      );
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { message: "Server configuration error: Blob storage not available." },
        { status: 500 },
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    let fileContent = "";

    const fileType = file.type;
    const originalFileName = file.name || "unnamed_file";
    const fileExtension = originalFileName.split(".").pop()?.toLowerCase();

    console.log(
      `Processing file: ${originalFileName}, Type: ${fileType}, Size: ${fileBuffer.length} bytes`,
    );

    try {
      if (fileType === "application/pdf" || fileExtension === "pdf") {
        fileContent = await parsePdf(fileBuffer);
        if (fileContent.length < 100 && fileBuffer.byteLength > 100 * 1024) {
          return NextResponse.json(
            {
              message:
                "This PDF appears to be a scanned document with minimal selectable text. Please ensure it is a searchable PDF or upload its pages as images for OCR.",
            },
            { status: 400 },
          );
        }
      } else if (
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileExtension === "docx"
      ) {
        fileContent = await parseDocx(fileBuffer);
      } else if (
        fileType === "image/jpeg" ||
        fileType === "image/png" ||
        fileExtension === "jpg" ||
        fileExtension === "jpeg" ||
        fileExtension === "png"
      ) {
        fileContent = await performOcr(fileBuffer);
        if (fileContent.length < 10 && fileBuffer.byteLength > 10 * 1024) {
          return NextResponse.json(
            {
              message:
                "Could not extract significant text from the image. Ensure the image contains clear text.",
            },
            { status: 400 },
          );
        }
      } else if (
        fileType.startsWith("text/") ||
        ["txt", "md", "csv", "json", "log"].includes(fileExtension || "")
      ) {
        fileContent = fileBuffer.toString("utf8");
      } else {
        return NextResponse.json(
          {
            message: `Unsupported file type: ${
              fileType || fileExtension
            }. Please upload PDF, DOCX, JPG, PNG, or text files.`,
          },
          { status: 400 },
        );
      }
    } catch (parseError) {
      console.error("File parsing error:", parseError);
      return NextResponse.json(
        {
          message: `Failed to process ${fileType || fileExtension} file: ${
            parseError instanceof Error ? parseError.message : "Unknown error"
          }`,
        },
        { status: 400 },
      );
    }

    if (!fileContent || fileContent.trim().length === 0) {
      return NextResponse.json(
        {
          message:
            "No text content could be extracted from the file. Please ensure the file contains readable text.",
        },
        { status: 400 },
      );
    }

    console.log(`Extracted ${fileContent.length} characters from file`);

    const uniqueId = uuidv4();
    const blobFileName = `${originalFileName.substring(
      0,
      originalFileName.lastIndexOf("."),
    )}_${uniqueId}${fileExtension ? "." + fileExtension : ""}`;

    const blob = await put(blobFileName, fileBuffer, { access: "public" });
    const originalFileUrl = blob.url;

    await connectToDatabase();

    const generatedContent = await generateContentWithAI(
      fileContent,
      generationType,
    );

    const newGeneration = new Generation({
      originalContent: fileContent,
      generatedContent,
      fileName: originalFileName,
      generationType,
      uploadDate: new Date(),
      originalFileUrl,
      userId: userId,
    });

    await newGeneration.save();

    return NextResponse.json(
      {
        generatedContent,
        message: "Content generated and saved successfully!",
        id: newGeneration._id.toString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong during processing.";

    if (errorMessage.startsWith("AI_API_KEY_INVALID:")) {
      return NextResponse.json(
        {
          message:
            "Gemini API key is invalid for current project. Create a key in Google AI Studio and use it in GOOGLE_API_KEY or GEMINI_API_KEY.",
          error: errorMessage,
        },
        { status: 401 },
      );
    }

    if (errorMessage.startsWith("AI_MODEL_INVALID:")) {
      return NextResponse.json(
        {
          message:
            "Gemini model id is invalid. Set GEMINI_MODEL (or GENERATIVE_MODEL) to a valid id like gemini-2.5-flash.",
          error: errorMessage,
        },
        { status: 400 },
      );
    }

    if (errorMessage.startsWith("AI_MODEL_BUSY:")) {
      return NextResponse.json(
        {
          message:
            "Gemini model is currently experiencing high demand. Please retry in a few moments.",
          error: errorMessage,
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { message: errorMessage, error: errorMessage },
      { status: 500 },
    );
  }
}
