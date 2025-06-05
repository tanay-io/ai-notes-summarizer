"use client";

import { use, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link"; // Import Link for navigation to dashboard

enum GenerationType {
  SUMMARY = "summary",
  FLASHCARDS = "flashcards",
  KEY_POINTS = "key_points",
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [generationType, setgenerationType] = useState<GenerationType>(
    GenerationType.SUMMARY
  );
  const [currentGenerationId, setCurrentGenerationId] = useState<string | null>(
    null
  );
  const [userGivenName, setUserGivenName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError("File size exceeds the limit of ${MAX_FILE_SIZE_MB} MB.");
    }
    setIsLoading(true);
    setError(null);
    setGeneratedContent("");
    setShowNameInput(false);
    setUserGivenName("");
    setCurrentGenerationId(null);
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("generationType", generationType);
    const res = await fetch("api/upload", {
      method: "POST",
      body: formdata,
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to genrate content.");
    }
    const data = await res.json();
    setGeneratedContent(data.setGeneratedContent);
    setCurrentGenerationId(data.id);
    setShowNameInput(true);
  }
  async function handleSaveName() {
    if (!currentGenerationId || !userGivenName.trim!) {
      setError("Please provide us a name for your content.");
      return;
    }
    const res = await fetch(`/api/generations/${currentGenerationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userGivenName: userGivenName }),
    });
    setShowNameInput(false);
    setUserGivenName("");
    setCurrentGenerationId(null);
  }
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 border rounded-lg shadow-md p-6 bg-white"
      >
        <div className="space-y-2">
          <Label htmlFor="file">Upload File (PDF, DOCX, JPG, PNG)</Label>
          <Input
            id="file"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept=".pdf,.docx,.jpg,.jpeg,.png"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="generation-type">Choose Generation Type</Label>
          <Select
            value={generationType}
            onValueChange={(value: GenerationType) => setgenerationType(value)}
          >
            <SelectTrigger className="w-full" id="generation-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={GenerationType.SUMMARY}>Summary</SelectItem>
              <SelectItem value={GenerationType.FLASHCARDS}>
                Flashcards
              </SelectItem>
              <SelectItem value={GenerationType.KEY_POINTS}>
                5-6 Key Points
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Content"}
        </Button>
      </form>
      {generatedContent && (
        <Card className="bg-white">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Generated Content:</h2>
            <Textarea
              readOnly
              value={generatedContent}
              rows={10}
              className="w-full font-mono text-sm"
            />

            {showNameInput && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="user-given-name">
                  Name your generation (optional)
                </Label>
                <Input
                  id="user-given-name"
                  type="text"
                  value={userGivenName}
                  onChange={(e) => setUserGivenName(e.target.value)}
                  placeholder="e.g., 'Summary of Q2 Report'"
                />
                <Button onClick={handleSaveName} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Name"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      \{" "}
      <div className="text-center mt-8">
        <Link href="/generations" className="text-blue-600 hover:underline">
          View All Generations (Dashboard)
        </Link>
      </div>
    </div>
  );
}
