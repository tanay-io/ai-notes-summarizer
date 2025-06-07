import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Generation from "@/models/generation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authoptions";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    await connectToDatabase();

    const generations = await Generation.find({ userId: userId }).sort({
      uploadDate: -1,
    });

    return NextResponse.json({ generations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching generations:", error);
    return NextResponse.json(
      { message: "Failed to fetch generations." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();

    const {
      originalContent,
      generatedContent,
      fileName,
      generationType,
      userGivenName,
      originalFileUrl,
    } = body;

    if (!originalContent || !generatedContent || !fileName || !generationType) {
      return NextResponse.json(
        { message: "Missing required generation fields." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newGeneration = new Generation({
      originalContent,
      generatedContent,
      fileName,
      generationType,
      userGivenName,
      uploadDate: new Date(),
      originalFileUrl,
      userId: userId,
    });

    await newGeneration.save();

    return NextResponse.json(
      { message: "Generation created successfully", generation: newGeneration },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating generation:", error);
    return NextResponse.json(
      { message: "Failed to create generation." },
      { status: 500 }
    );
  }
}
