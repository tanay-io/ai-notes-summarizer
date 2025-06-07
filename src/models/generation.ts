import mongoose, { Document, Schema } from "mongoose";

export enum GenerationType {
  SUMMARY = "summary",
  FLASHCARDS = "flashcards",
  KEY_POINTS = "key_points",
}

export interface IGeneration extends Document {
  originalContent: string;
  generatedContent: string;
  fileName: string;
  generationType: GenerationType;
  userGivenName?: string;
  uploadDate: Date;
  originalFileUrl: string;
  userId: mongoose.Types.ObjectId;
}

const GenerationSchema: Schema = new Schema({
  originalContent: {
    type: String,
    required: true,
  },
  generatedContent: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  generationType: {
    type: String,
    enum: Object.values(GenerationType),
    required: true,
  },
  userGivenName: {
    type: String,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },

  originalFileUrl: {
    type: String,
    required: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Generation =
  mongoose.models.Generation ||
  mongoose.model<IGeneration>("Generation", GenerationSchema);

export default Generation;
