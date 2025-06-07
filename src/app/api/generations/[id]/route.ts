import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Generation from "@/models/generation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

interface Params {
  id: string;
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const { id } = params;
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    await connectToDatabase();
    const { userGivenName } = await req.json();

    if (!userGivenName || typeof userGivenName !== "string") {
      return NextResponse.json(
        { message: "Invalid name provided." },
        { status: 400 }
      );
    }

    const updatedGeneration = await Generation.findOneAndUpdate(
      { _id: id, userId: userId },
      { userGivenName: userGivenName },
      { new: true }
    );

    if (!updatedGeneration) {
      const existingGeneration = await Generation.findById(id);
      if (
        existingGeneration &&
        existingGeneration.userId.toString() !== userId
      ) {
        return NextResponse.json(
          { message: "Forbidden: You do not own this generation." },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { message: "Generation not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Name updated successfully", generation: updatedGeneration },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating generation name:", error);
    return NextResponse.json(
      { message: "Failed to update generation name." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { id } = params;
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    await connectToDatabase();
    const generation = await Generation.findOne({ _id: id, userId: userId });

    if (!generation) {
      const existingGeneration = await Generation.findById(id);
      if (
        existingGeneration &&
        existingGeneration.userId.toString() !== userId
      ) {
        return NextResponse.json(
          { message: "Forbidden: You do not own this generation." },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { message: "Generation not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ generation }, { status: 200 });
  } catch (error) {
    console.error("Error fetching single generation:", error);
    return NextResponse.json(
      { message: "Failed to fetch generation." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const { id } = params;
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    await connectToDatabase();

    const deletedGeneration = await Generation.findOneAndDelete({
      _id: id,
      userId: userId,
    });

    if (!deletedGeneration) {
      const existingGeneration = await Generation.findById(id);
      if (
        existingGeneration &&
        existingGeneration.userId.toString() !== userId
      ) {
        return NextResponse.json(
          { message: "Forbidden: You do not own this generation." },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { message: "Generation not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Generation deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting generation:", error);
    return NextResponse.json(
      { message: "Failed to delete generation." },
      { status: 500 }
    );
  }
}
