"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { format } from "date-fns";
import {
  FileText,
  Brain,
  Target,
  Upload,
  LogOut,
  AlertCircle,
  Loader2,
  ChevronRight,
  Clock,
  File,
} from "lucide-react";

interface IGenerationItem {
  _id: string;
  userGivenName?: string;
  generationType: string;
  fileName: string;
  uploadDate: string;
  originalFileUrl?: string;
}

// Helper function to get icon based on generation type
const getGenerationIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "summary":
      return FileText;
    case "flashcards":
      return Brain;
    case "key_points":
      return Target;
    default:
      return FileText;
  }
};

// Helper function to get color based on generation type
const getGenerationColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "summary":
      return {
        bg: "bg-blue-50 dark:bg-blue-950/50",
        border: "border-blue-200 dark:border-blue-800",
        text: "text-blue-700 dark:text-blue-300",
      };
    case "flashcards":
      return {
        bg: "bg-purple-50 dark:bg-purple-950/50",
        border: "border-purple-200 dark:border-purple-800",
        text: "text-purple-700 dark:text-purple-300",
      };
    case "key_points":
      return {
        bg: "bg-green-50 dark:bg-green-950/50",
        border: "border-green-200 dark:border-green-800",
        text: "text-green-700 dark:text-green-300",
      };
    default:
      return {
        bg: "bg-gray-50 dark:bg-gray-900/50",
        border: "border-gray-200 dark:border-gray-700",
        text: "text-gray-700 dark:text-gray-300",
      };
  }
};

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();

  const [generations, setGenerations] = useState<IGenerationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    if (status === "authenticated") {
      async function fetchGenerations() {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch("/api/generations");
          if (!res.ok) {
            throw new Error("Failed to fetch generations.");
          }
          const data = await res.json();
          setGenerations(data.generations);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unexpected error occurred."
          );
        } finally {
          setIsLoading(false);
        }
      }
      fetchGenerations();
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 text-blue-600 dark:text-blue-400 animate-spin" />
          <p className="text-xl font-medium text-gray-900 dark:text-white">
            Loading session...
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          <p className="text-xl font-medium text-red-600 dark:text-red-400">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Your Generated Content
            </h1>
            <div className="flex items-center space-x-3">
              <Link href="/upload" passHref>
                <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New File
                </Button>
              </Link>
              <Button
                onClick={() => signOut()}
                variant="outline"
                className="rounded-xl border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className="border-0 shadow-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm h-[200px]"
                >
                  <CardHeader>
                    <Skeleton className="h-8 w-3/4 rounded-lg" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-1/2 rounded-lg" />
                      <Skeleton className="h-4 w-2/3 rounded-lg" />
                      <Skeleton className="h-4 w-1/3 rounded-lg" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-700 dark:text-red-300 font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Empty State */}
          {!isLoading && !error && generations.length === 0 && (
            <div className="text-center py-16 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 dark:bg-blue-950/50 rounded-full mb-6">
                <File className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                No generated content yet
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Upload a file to start generating summaries, flashcards, or key
                points from your documents.
              </p>
              <Link href="/upload" passHref>
                <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Your First File
                </Button>
              </Link>
            </div>
          )}

          {/* Content Grid */}
          {!isLoading && !error && generations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generations.map((gen) => {
                const Icon = getGenerationIcon(gen.generationType);
                const colors = getGenerationColor(gen.generationType);

                return (
                  <Link
                    href={`/dashboard/${gen._id}`}
                    key={gen._id}
                    passHref
                    className="group"
                  >
                    <Card className="border-0 shadow-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm h-full flex flex-col transition-all duration-200 hover:shadow-xl hover:scale-[1.02]">
                      <CardHeader
                        className={`${colors.bg} rounded-t-xl border-b ${colors.border}`}
                      >
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <Icon className={`h-5 w-5 ${colors.text}`} />
                            </div>
                            <span className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                              {gen.userGivenName ||
                                `Unnamed ${gen.generationType}`}
                            </span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow p-5">
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                            <File className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                            <span className="truncate">{gen.fileName}</span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="h-3 w-3 mr-2" />
                            {format(
                              new Date(gen.uploadDate),
                              "MMM dd, yyyy HH:mm"
                            )}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
