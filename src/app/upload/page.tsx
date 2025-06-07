"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  X,
  File,
  Moon,
  Sun,
  ArrowUpCircle,
  Loader2,
} from "lucide-react";

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
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    borderColor: "border-blue-200 dark:border-blue-800",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  {
    value: GenerationType.FLASHCARDS,
    label: "Flashcards",
    description: "Generate study cards for memorization",
    icon: Brain,
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/50",
    borderColor: "border-purple-200 dark:border-purple-800",
    textColor: "text-purple-700 dark:text-purple-300",
  },
  {
    value: GenerationType.KEY_POINTS,
    label: "Key Points",
    description: "Extract 5-6 main insights",
    icon: Target,
    gradient: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/50",
    borderColor: "border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-300",
  },
];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [generationType, setGenerationType] = useState<GenerationType>(
    GenerationType.SUMMARY
  );
  const [currentGenerationId, setCurrentGenerationId] = useState<string | null>(
    null
  );
  const [userGivenName, setUserGivenName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError(null);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    setSuccess(null);
    setGeneratedContent("");
    setShowNameInput(false);
    setUserGivenName("");
    setCurrentGenerationId(null);
    setUploadProgress(0);

    // Simulate progress
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

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock successful response
      const mockContent = `Generated ${generationType} content for ${file.name}:\n\nThis is a sample generated content that would normally come from your AI processing. The content would be tailored based on the selected generation type and the uploaded file content.`;

      setGeneratedContent(mockContent);
      setCurrentGenerationId("mock-id-" + Date.now());
      setShowNameInput(true);
      setUploadProgress(100);
      setSuccess("Content generated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
      clearInterval(progressInterval);
    }
  };

  const handleSaveName = async () => {
    if (!currentGenerationId || !userGivenName.trim()) {
      setError("Please provide a name for your content.");
      return;
    }

    try {
      // Simulate save API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowNameInput(false);
      setUserGivenName("");
      setCurrentGenerationId(null);
      setSuccess("Content saved successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save name");
    }
  };

  const selectedOption = generationOptions.find(
    (option) => option.value === generationType
  );

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md dark:bg-gray-950/80 dark:border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <Link href="/">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      AI Notes Summarizer
                    </h1>
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Transform your documents into actionable insights
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDarkMode(!darkMode)}
                  className="rounded-full"
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline" className="rounded-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Upload Section */}
            <Card className="border-0 shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-t-xl border-b">
                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <ArrowUpCircle className="h-6 w-6" />
                  <span>Upload &amp; Generate Content</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* File Upload Area */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold text-gray-900 dark:text-white">
                      Upload Document
                    </Label>
                    <div
                      className={`relative group border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                        isDragOver
                          ? "border-blue-400 bg-blue-50 dark:bg-blue-950/50 scale-[1.02]"
                          : file
                          ? "border-green-400 bg-green-50 dark:bg-green-950/50"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
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

                      {file ? (
                        <div className="space-y-4">
                          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-2xl">
                            <File className="h-10 w-10 text-green-600 dark:text-green-400" />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile();
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-md mx-auto">
                              {file.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Ready to process
                          </Badge>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                            <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                          </div>
                          <div>
                            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                              Drop your file here
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">
                              or click to browse your files
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-white dark:bg-gray-800"
                          >
                            PDF, DOCX, JPG, PNG • Max {MAX_FILE_SIZE_MB}MB
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generation Type Selection */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold text-gray-900 dark:text-white">
                      Choose Generation Type
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {generationOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = generationType === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setGenerationType(option.value)}
                            className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-200 group ${
                              isSelected
                                ? `${option.bgColor} ${option.borderColor} ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400 scale-[1.02]`
                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 hover:scale-[1.01]"
                            }`}
                          >
                            <div className="flex items-start space-x-4">
                              <div
                                className={`p-3 rounded-xl ${
                                  isSelected
                                    ? "bg-white dark:bg-gray-800"
                                    : "bg-gray-100 dark:bg-gray-700"
                                } group-hover:scale-110 transition-transform duration-200`}
                              >
                                <Icon
                                  className={`h-6 w-6 ${
                                    isSelected
                                      ? option.textColor
                                      : "text-gray-500 dark:text-gray-400"
                                  }`}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`font-semibold text-lg ${
                                    isSelected
                                      ? option.textColor
                                      : "text-gray-900 dark:text-white"
                                  }`}
                                >
                                  {option.label}
                                </p>
                                <p
                                  className={`text-sm mt-2 ${
                                    isSelected
                                      ? option.textColor + " opacity-80"
                                      : "text-gray-500 dark:text-gray-400"
                                  }`}
                                >
                                  {option.description}
                                </p>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="absolute top-3 right-3">
                                <CheckCircle
                                  className={`h-5 w-5 ${option.textColor}`}
                                />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !file}
                    className={`w-full h-14 text-lg font-semibold rounded-2xl transition-all duration-200 ${
                      selectedOption
                        ? `bg-gradient-to-r ${selectedOption.gradient} hover:scale-[1.02] shadow-lg hover:shadow-xl`
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    } text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Generating Content...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <Zap className="h-5 w-5" />
                        <span>Generate {selectedOption?.label}</span>
                      </div>
                    )}
                  </Button>

                  {/* Progress Bar */}
                  {isLoading && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
                        <span>Processing your document...</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <Progress
                        value={uploadProgress}
                        className="h-3 rounded-full"
                      />
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Alerts */}
            {error && (
              <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-700 dark:text-red-300 font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-700 dark:text-green-300 font-medium">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Generated Content */}
            {generatedContent && (
              <Card className="border-0 shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-t-xl border-b">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-gray-900 dark:text-white">
                      {selectedOption && (
                        <selectedOption.icon className="h-6 w-6" />
                      )}
                      <span>Generated {selectedOption?.label}</span>
                    </div>
                    <Badge className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <Textarea
                      readOnly
                      value={generatedContent}
                      rows={12}
                      className="w-full font-mono text-sm resize-none border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-gray-50 dark:bg-gray-800"
                    />

                    {showNameInput && (
                      <Card className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <Label
                              htmlFor="user-given-name"
                              className="text-base font-semibold text-blue-900 dark:text-blue-200"
                            >
                              Save this generation (optional)
                            </Label>
                            <div className="flex space-x-3">
                              <Input
                                id="user-given-name"
                                type="text"
                                value={userGivenName}
                                onChange={(e) =>
                                  setUserGivenName(e.target.value)
                                }
                                placeholder='e.g., "Summary of Q2 Report"'
                                className="flex-1 border-blue-200 dark:border-blue-700 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                              />
                              <Button
                                onClick={handleSaveName}
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl"
                              >
                                {isLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Save"
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
