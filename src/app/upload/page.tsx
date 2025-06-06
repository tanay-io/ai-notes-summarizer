"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  Upload,
  FileText,
  Brain,
  Zap,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BookOpen,
  Target,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

enum GenerationType {
  SUMMARY = "summary",
  FLASHCARDS = "flashcards",
  KEY_POINTS = "key_points",
}

const generationOptions = [
  {
    value: GenerationType.SUMMARY,
    label: "Summary",
    description: "Create a concise overview of your content",
    icon: FileText,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    value: GenerationType.FLASHCARDS,
    label: "Flashcards",
    description: "Generate study cards for memorization",
    icon: Brain,
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    value: GenerationType.KEY_POINTS,
    label: "Key Points",
    description: "Extract 5-6 main insights",
    icon: Target,
    color: "bg-green-50 text-green-700 border-green-200",
  },
];

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [generationType, setGenerationType] = useState<GenerationType>(
    GenerationType.SUMMARY
    
  );
  const [currentGenerationId, setCurrentGenerationId] = useState<string | null>(
    null
  );
  const [userGivenName, setUserGivenName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [darkMode, setDarkMode] = useState(false);

  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size exceeds the limit of ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedContent("");
    setShowNameInput(false);
    setUserGivenName("");
    setCurrentGenerationId(null);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("generationType", generationType);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to generate content.");
      }

      const data = await res.json();
      setGeneratedContent(data.generatedContent);
      setCurrentGenerationId(data.id);
      setShowNameInput(true);
      setUploadProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
      clearInterval(progressInterval);
    }
  }

  async function handleSaveName() {
    if (!currentGenerationId || !userGivenName.trim()) {
      setError("Please provide a name for your content.");
      return;
    }

    try {
      const res = await fetch(`/api/generations/${currentGenerationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userGivenName: userGivenName.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to save name");
      }

      setShowNameInput(false);
      setUserGivenName("");
      setCurrentGenerationId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save name");
    }
  }

  const selectedOption = generationOptions.find(
    (option) => option.value === generationType
  );

  return (
    <div className={darkMode ? "dark min-h-screen" : "min-h-screen"}>
      <div
        className={
          darkMode
            ? "min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
            : "min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50"
        }
      >
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:scale-105 transition"
        >
          🌙
        </button>

        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    AI Notes Summarizer
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    Transform your documents into actionable insights
                  </p>
                </div>
              </div>
              <Link
                href="/generations"
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Upload Form */}
            <Card className="bg-white dark:bg-gray-900 shadow-lg border-0 ring-1 ring-gray-900/5 dark:ring-gray-700">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <Upload className="h-5 w-5" />
                  <span>Upload & Generate</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Upload Document
                    </Label>
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                        isDragOver
                          ? "border-blue-400 bg-blue-50 dark:bg-gray-800"
                          : file
                          ? "border-green-400 bg-green-50 dark:bg-gray-800"
                          : "border-gray-300 hover:border-gray-400 bg-gray-50 dark:bg-gray-800"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        accept=".pdf,.docx,.jpg,.jpeg,.png"
                        className="hidden"
                      />
                      <div className="space-y-3">
                        {file ? (
                          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                        ) : (
                          <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                        )}
                        <div>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {file ? file.name : "Drop your file here"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                            {file
                              ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                              : "or click to browse"}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-white dark:bg-gray-900"
                        >
                          PDF, DOCX, JPG, PNG • Max {MAX_FILE_SIZE_MB}MB
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Choose Generation Type
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {generationOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = generationType === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setGenerationType(option.value)}
                            className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                              isSelected
                                ? option.color +
                                  " ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400"
                                : "border-gray-200 hover:border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700"
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <Icon
                                className={`h-5 w-5 mt-0.5 ${
                                  isSelected ? "" : "text-gray-400"
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`font-medium ${
                                    isSelected
                                      ? ""
                                      : "text-gray-900 dark:text-white"
                                  }`}
                                >
                                  {option.label}
                                </p>
                                <p
                                  className={`text-sm mt-1 ${
                                    isSelected
                                      ? "opacity-90"
                                      : "text-gray-500 dark:text-gray-300"
                                  }`}
                                >
                                  {option.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !file}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4" />
                        <span>Generate Content</span>
                      </div>
                    )}
                  </Button>

                  {isLoading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span>Processing your document...</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Card className="bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-red-700 dark:text-red-300">
                    <AlertCircle className="h-5 w-5" />
                    <p className="font-medium">{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {generatedContent && (
              <Card className="bg-white dark:bg-gray-900 shadow-lg border-0 ring-1 ring-gray-900/5 dark:ring-gray-700">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-t-lg">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                      {selectedOption && (
                        <selectedOption.icon className="h-5 w-5" />
                      )}
                      <span>Generated {selectedOption?.label}</span>
                    </div>
                    <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Textarea
                      readOnly
                      value={generatedContent}
                      rows={12}
                      className="w-full font-mono text-sm resize-none border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                    />

                    {showNameInput && (
                      <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="space-y-3">
                          <Label
                            htmlFor="user-given-name"
                            className="text-sm font-medium text-blue-900 dark:text-blue-200"
                          >
                            Save this generation (optional)
                          </Label>
                          <div className="flex space-x-2">
                            <Input
                              id="user-given-name"
                              type="text"
                              value={userGivenName}
                              onChange={(e) => setUserGivenName(e.target.value)}
                              placeholder="e.g., 'Summary of Q2 Report'"
                              className="flex-1 border-blue-200 dark:border-blue-700 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <Button
                              onClick={handleSaveName}
                              disabled={isLoading}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                            >
                              {isLoading ? "Saving..." : "Save"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
