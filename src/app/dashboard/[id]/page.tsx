"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TypeBadge } from "@/components/common/TypeBadge";

type GenerationType = "summary" | "flashcards" | "key_points";

type GenerationDetail = {
  _id: string;
  generatedContent: string;
  originalContent: string;
  fileName: string;
  generationType: GenerationType;
  userGivenName?: string;
  uploadDate: string;
  originalFileUrl?: string;
};

export default function GenerationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { status } = useSession();

  const [item, setItem] = useState<GenerationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status !== "authenticated") return;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/generations/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch generation.");
        }

        setItem(data.generation);
        setName(data.generation.userGivenName || "");
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load generation details."
        );
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [params.id, router, status]);

  const formattedDate = useMemo(() => {
    if (!item) return "";
    return new Date(item.uploadDate).toLocaleString();
  }, [item]);

  const handleSaveName = async () => {
    if (!item) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/generations/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userGivenName: name.trim() || "Untitled" }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update name.");
      }

      setItem(data.generation);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    if (!item) return;

    await navigator.clipboard.writeText(item.generatedContent);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const handleDelete = async () => {
    if (!item) return;

    const confirmed = window.confirm(
      "Delete this generation? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/generations/${item._id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed.");
      }

      router.push("/dashboard");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Unable to delete"
      );
    }
  };

  if (status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-[#FAF8F4] text-[#7A756A]">
        Loading session...
      </div>
    );
  }

  return (
    <AppShell>
      <div className="px-4 py-8 md:px-8">
        <div className="mx-auto w-full max-w-[760px]">
          <Link
            href="/dashboard"
            className="mb-5 inline-flex items-center gap-2 rounded-lg border border-[#E8E1D6] bg-white px-3 py-2 text-sm text-[#3A3832] transition hover:border-[#B5B0A5]"
          >
            <ArrowLeft className="h-4 w-4" />
            All generations
          </Link>

          {isLoading ? (
            <div className="skeleton-shimmer h-[340px] rounded-xl border border-[#E8E1D6]" />
          ) : error ? (
            <div className="error-callout">{error}</div>
          ) : item ? (
            <div className="rounded-xl border border-[#E8E1D6] bg-white">
              <header className="space-y-4 border-b border-[#E8E1D6] bg-[#F2EDE6] px-5 py-5">
                <div className="flex items-center gap-3">
                  <TypeBadge type={item.generationType} />
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full border-b border-transparent bg-transparent pb-1 font-serif text-[1.65rem] text-[#0F0E0C] outline-none transition focus:border-[#C97C2A]"
                    placeholder="Untitled generation"
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E8E1D6] bg-white px-3 py-2 text-xs text-[#3A3832] transition hover:border-[#B5B0A5] disabled:opacity-60"
                  >
                    {isSaving ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    Save
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] uppercase tracking-[0.08em] text-[#B5B0A5]">
                  <span>{item.fileName}</span>
                  <span>{formattedDate}</span>
                  <span>{item.generationType}</span>
                </div>
              </header>

              <section className="p-5">
                <div className="rounded-lg border border-[#E8E1D6] bg-[#FAF8F4] p-6 text-[0.9375rem] leading-[1.8] text-[#3A3832]">
                  {item.generatedContent}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#E8E1D6] bg-white px-3 py-2 text-sm text-[#3A3832] transition hover:border-[#B5B0A5]"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? "Copied" : "Copy text"}
                  </button>

                  {item.originalFileUrl && (
                    <a
                      href={item.originalFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#E8E1D6] bg-white px-3 py-2 text-sm text-[#3A3832] transition hover:border-[#B5B0A5]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View source file
                    </a>
                  )}

                  <button
                    onClick={handleDelete}
                    className="ml-auto inline-flex items-center gap-2 rounded-lg border border-[#f0bdbd] bg-[#FCEBEB] px-3 py-2 text-sm text-[#A32D2D] transition hover:bg-[#f8dede]"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
