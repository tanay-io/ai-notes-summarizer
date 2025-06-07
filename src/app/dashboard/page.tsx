"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";

interface IGenerationItem {
  _id: string;
  userGivenName?: string;
  generationType: string;
  fileName: string;
  uploadDate: string;
  originalFileUrl?: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
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
    return <div className="p-6 text-center text-lg">Loading session...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="p-6 text-center text-red-500 text-lg">
        Redirecting to login...
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center text-lg">Loading generations...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 text-lg">Error: {error}</div>
    );
  }

  if (generations.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-center flex-grow">
            Your Generated Content
          </h1>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </div>
        <div className="text-center">
          <Link href="/upload" passHref>
            <Button>Upload New File</Button>
          </Link>
        </div>
        <p className="text-center text-gray-500">
          No generated content yet. Upload a file to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-center flex-grow">
          Your Generated Content
        </h1>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </div>

      <div className="text-center">
        <Link href="/upload" passHref>
          <Button>Upload New File</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {generations.map((gen) => (
          <Link href={`/dashboard/${gen._id}`} key={gen._id} passHref>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">
                  {gen.userGivenName ||
                    `Unnamed ${gen.generationType} (${gen.fileName})`}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600">
                  Type: <span className="capitalize">{gen.generationType}</span>
                </p>
                <p className="text-sm text-gray-600">File: {gen.fileName}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Uploaded:{" "}
                  {format(new Date(gen.uploadDate), "MMM dd, yyyy HH:mm")}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
