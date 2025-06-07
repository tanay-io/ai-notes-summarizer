"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { format } from "date-fns";
import { useSession } from "next-auth/react"; // Import useSession

interface IGenerationDetail {
  _id: string;
  originalContent: string;
  generatedContent: string;
  fileName: string;
  generationType: string;
  userGivenName?: string;
  uploadDate: string;
  originalFileUrl: string;
  userId: string; // Add userId to the client-side interface
}

export default function GenerationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter(); // Initialize useRouter
  const { data: session, status } = useSession(); // Get session

  const [generation, setGeneration] = useState<IGenerationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (!id || status !== "authenticated") return; // Only fetch if ID exists and user is authenticated

    async function fetchGenerationDetails() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/generations/${id}`);
        if (!res.ok) {
          if (res.status === 403) {
            // Forbidden if not owner
            throw new Error(
              "You do not have permission to view this generation."
            );
          }
          throw new Error("Failed to fetch generation details.");
        }
        const data = await res.json();
        setGeneration(data.generation);
      } catch (err) {
        console.error("Error fetching generation details:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchGenerationDetails();
  }, [id, status, router]); // Add status and router to dependencies

  if (status === "loading") {
    return <div className="p-6 text-center text-lg">Loading session...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="p-6 text-center text-red-500 text-lg">
        Redirecting to login...
      </div>
    );
  }

  // If status is authenticated
  if (isLoading) {
    return <div className="p-6 text-center text-lg">Loading details...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 text-lg">Error: {error}</div>
    );
  }

  if (!generation) {
    return (
      <div className="p-6 text-center text-gray-500">Generation not found.</div>
    );
  }

  // If you want to add functionality to update the userGivenName from this page,
  // you'd add a state for the input field and a handleSubmit function that makes
  // a PUT request to /api/generations/${id} with the new name.
  // Remember to include the session token in the request headers (NextAuth handles this automatically for client fetches).

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link href="/dashboard" passHref>
        <Button variant="outline">← Back to Dashboard</Button>
      </Link>

      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">
            {generation.userGivenName ||
              `Generated ${generation.generationType} from ${generation.fileName}`}
          </CardTitle>
          <p className="text-md text-gray-600">
            Type:{" "}
            <span className="capitalize">{generation.generationType}</span>
          </p>
          <p className="text-sm text-gray-600">
            Original File: {generation.fileName}
          </p>
          <p className="text-xs text-gray-500">
            Generated On:{" "}
            {format(new Date(generation.uploadDate), "MMM dd, yyyy HH:mm")}
          </p>
          {generation.originalFileUrl && (
            <div className="mt-4">
              <a
                href={generation.originalFileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>View Original File</Button>
              </a>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Generated {generation.generationType}:
            </h3>
            <Textarea
              readOnly
              value={generation.generatedContent}
              rows={10}
              className="w-full font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
