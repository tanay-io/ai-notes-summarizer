"use client";

import { FormEvent, useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  File,
  FileText,
  Layers,
  Loader2,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { successVariants } from "@/lib/motion-variants";

enum GenerationType {
  SUMMARY = "summary",
  FLASHCARDS = "flashcards",
  KEY_POINTS = "key_points",
}

const generationOptions = [
  {
    value: GenerationType.SUMMARY,
    label: "Summary",
    description: "Condense the document into a concise overview.",
    icon: FileText,
  },
  {
    value: GenerationType.FLASHCARDS,
    label: "Flashcards",
    description: "Create question-answer cards for retention.",
    icon: Layers,
  },
  {
    value: GenerationType.KEY_POINTS,
    label: "Key points",
    description: "Extract the most important 5-6 insights.",
    icon: Sparkles,
  },
];

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [generationType, setGenerationType] = useState<GenerationType>(
    GenerationType.SUMMARY
  );
  const [generatedContent, setGeneratedContent] = useState("");
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [userGivenName, setUserGivenName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const dropped = event.dataTransfer.files?.[0];
    if (!dropped) return;
    setFile(dropped);
    setError(null);
  }, []);

  const resetFlow = () => {
    setGeneratedContent("");
    setGenerationId(null);
    setShowNameInput(false);
    setUserGivenName("");
    setSuccess(null);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!file) {
      setError("Please choose a file first.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedContent("");
    setGenerationId(null);
    setShowNameInput(false);

    const timer = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 12, 92));
    }, 220);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("generationType", generationType);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Generation failed.");
      }

      setProgress(100);
      setGeneratedContent(data.generatedContent || "");
      setGenerationId(data.id || null);
      setShowNameInput(Boolean(data.id));
      setSuccess(data.message || "Generation complete.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to process your file."
      );
    } finally {
      clearInterval(timer);
      setIsGenerating(false);
    }
  };

  const handleSaveName = async () => {
    if (!generationId || !userGivenName.trim()) {
      setError("Enter a name before saving.");
      return;
    }

    setError(null);
    setIsSavingName(true);

    try {
      const response = await fetch(`/api/generations/${generationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userGivenName: userGivenName.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save name.");
      }

      setShowNameInput(false);
      setSuccess("Name saved successfully.");
    } catch (nameError) {
      setError(nameError instanceof Error ? nameError.message : "Save failed.");
    } finally {
      setIsSavingName(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[800px] px-4 py-8 md:px-8">
        <div className="mb-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#C97C2A]">
            Upload workspace
          </p>
          <h1 className="mt-2 text-4xl">Generate new content</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#7A756A]">
            Upload a file, choose generation type, and produce structured output
            with clear hierarchy and smooth feedback states.
          </p>
        </div>

        <div className="rounded-xl border border-[#E8E1D6] bg-white p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[#B5B0A5]">
                1. Source file
              </p>
              <div
                role="button"
                tabIndex={0}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    inputRef.current?.click();
                  }
                }}
                className={`upload-zone rounded-xl border-[1.5px] border-dashed p-10 text-center transition-all ${
                  isDragOver
                    ? "drag-over border-[#C97C2A] bg-[#F5E4C8]"
                    : "border-[#E8E1D6] bg-[#FAF8F4]"
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.docx,.jpg,.jpeg,.png,.txt,.md,.csv,.json,.log"
                  className="hidden"
                  onChange={(event) => {
                    const selected = event.target.files?.[0];
                    if (!selected) return;
                    setFile(selected);
                    setError(null);
                  }}
                />

                {file ? (
                  <div className="mx-auto max-w-md rounded-lg border border-[#E8E1D6] bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="rounded-md bg-[#F5E4C8] p-2 text-[#C97C2A]">
                          <File className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 text-left">
                          <p className="truncate text-sm font-medium text-[#3A3832]">
                            {file.name}
                          </p>
                          <p className="text-xs text-[#7A756A]">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setFile(null);
                          if (inputRef.current) inputRef.current.value = "";
                          resetFlow();
                        }}
                        className="rounded-full border border-[#E8E1D6] p-1 text-[#7A756A] transition hover:bg-[#FAF8F4]"
                        aria-label="Remove selected file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto mb-3 h-6 w-6 text-[#C97C2A]" />
                    <p className="text-sm text-[#3A3832]">Drop file here or click to browse</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-[#B5B0A5]">
                      PDF, DOCX, JPG, PNG, TXT · Max {MAX_FILE_SIZE_MB}MB
                    </p>
                  </>
                )}
              </div>
            </div>

            <div>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[#B5B0A5]">
                2. Generation type
              </p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {generationOptions.map((option) => {
                  const Icon = option.icon;
                  const selected = generationType === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setGenerationType(option.value)}
                      className={`rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-[#0F0E0C] bg-[#0F0E0C]"
                          : "border-[#E8E1D6] bg-white hover:border-[#B5B0A5]"
                      }`}
                    >
                      <span
                        className={`mb-3 inline-flex rounded-md p-2 ${
                          selected ? "bg-white/10 text-[#FAF8F4]" : "bg-[#F2EDE6] text-[#C97C2A]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <p
                        className={`font-medium ${
                          selected ? "text-[#FAF8F4]" : "text-[#3A3832]"
                        }`}
                      >
                        {option.label}
                      </p>
                      <p
                        className={`mt-1 text-xs leading-relaxed ${
                          selected ? "text-white/65" : "text-[#7A756A]"
                        }`}
                      >
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              disabled={isGenerating || !file}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F0E0C] px-4 py-3 text-sm text-[#FAF8F4] transition hover:bg-[#3A3832] disabled:cursor-not-allowed disabled:opacity-60"
              aria-busy={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  Generate {generationOptions.find((item) => item.value === generationType)?.label}
                </>
              )}
            </button>

            {isGenerating && (
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-[#7A756A]">
                  <span>Processing document...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#F2EDE6]">
                  <div
                    className="h-full bg-[#C97C2A] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {error && (
          <div className="error-callout mt-6">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-6 flex items-center gap-2 rounded-lg border border-[#E8E1D6] bg-[#F2EDE6] px-4 py-3 text-sm text-[#3A3832]">
            <Check className="h-4 w-4 text-[#C97C2A]" />
            {success}
          </div>
        )}

        {generatedContent && (
          <motion.section
            className="mt-6 rounded-xl border border-[#E8E1D6] bg-white"
            variants={successVariants}
            initial="hidden"
            animate="visible"
            aria-live="polite"
          >
            <header className="border-b border-[#E8E1D6] bg-[#F2EDE6] px-5 py-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#C97C2A]">
                Generated output
              </p>
            </header>

            <div className="space-y-4 p-5">
              <textarea
                readOnly
                value={generatedContent}
                rows={14}
                className="w-full resize-none rounded-lg border border-[#E8E1D6] bg-[#FAF8F4] p-4 text-sm leading-relaxed text-[#3A3832] outline-none"
              />

              {showNameInput && (
                <div className="rounded-lg border border-[#E8E1D6] bg-[#FAF8F4] p-4">
                  <label
                    htmlFor="generationName"
                    className="mb-2 block text-sm text-[#3A3832]"
                  >
                    Save custom name
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      id="generationName"
                      value={userGivenName}
                      onChange={(event) => setUserGivenName(event.target.value)}
                      placeholder="e.g. Midterm revision summary"
                      className="w-full rounded-lg border border-[#E8E1D6] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#C97C2A] focus:ring-2 focus:ring-[#C97C2A]/20"
                    />
                    <button
                      type="button"
                      onClick={handleSaveName}
                      disabled={isSavingName}
                      className="rounded-lg bg-[#0F0E0C] px-4 py-2.5 text-sm text-[#FAF8F4] transition hover:bg-[#3A3832] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSavingName ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                        </span>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </div>
    </AppShell>
  );
}
