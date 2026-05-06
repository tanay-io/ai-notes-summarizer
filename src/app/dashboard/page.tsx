"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TypeBadge } from "@/components/common/TypeBadge";

const GenerationType = {
  SUMMARY: "summary",
  FLASHCARDS: "flashcards",
  KEY_POINTS: "key_points",
} as const;

type GenerationType = (typeof GenerationType)[keyof typeof GenerationType];

type GenerationItem = {
  _id: string;
  generatedContent: string;
  fileName: string;
  generationType: GenerationType;
  userGivenName?: string;
  uploadDate: string;
};

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Summaries", value: GenerationType.SUMMARY },
  { label: "Flashcards", value: GenerationType.FLASHCARDS },
  { label: "Key points", value: GenerationType.KEY_POINTS },
];

export default function DashboardPage() {
  const router = useRouter();
  const { status } = useSession();

  const [items, setItems] = useState<GenerationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

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
        const response = await fetch("/api/generations");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch generations.");
        }

        setItems(data.generations || []);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load dashboard data."
        );
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [router, status]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const typeMatch = filter === "all" || item.generationType === filter;
      const text = `${item.userGivenName ?? ""} ${item.fileName} ${item.generatedContent}`.toLowerCase();
      const searchMatch = text.includes(search.toLowerCase());
      return typeMatch && searchMatch;
    });
  }, [filter, items, search]);

  const summaryCount = items.filter((item) => item.generationType === GenerationType.SUMMARY).length;
  const weekCount = items.filter((item) => {
    const sevenDays = 1000 * 60 * 60 * 24 * 7;
    return Date.now() - new Date(item.uploadDate).getTime() <= sevenDays;
  }).length;

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
        <div className="mx-auto w-full max-w-[1100px]">
          <div className="mb-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#C97C2A]">
              Dashboard
            </p>
            <h1 className="mt-2 text-4xl">Your generation library</h1>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-[#E8E1D6] bg-white p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#B5B0A5]">Total</p>
              <p className="mt-2 font-serif text-4xl text-[#0F0E0C]">{items.length}</p>
            </div>
            <div className="rounded-lg border border-[#E8E1D6] bg-white p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#B5B0A5]">Summaries</p>
              <p className="mt-2 font-serif text-4xl text-[#0F0E0C]">{summaryCount}</p>
            </div>
            <div className="rounded-lg border border-[#E8E1D6] bg-white p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#B5B0A5]">This week</p>
              <p className="mt-2 font-serif text-4xl text-[#0F0E0C]">{weekCount}</p>
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-3 rounded-lg border border-[#E8E1D6] bg-[#F2EDE6] p-3 md:flex-row md:items-center">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  className={`rounded-full px-3 py-1.5 text-xs transition ${
                    filter === item.value
                      ? "bg-[#0F0E0C] text-[#FAF8F4]"
                      : "bg-white text-[#7A756A] hover:text-[#3A3832]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <label className="relative md:ml-auto">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#B5B0A5]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search generations"
                className="w-full rounded-lg border border-[#E8E1D6] bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#C97C2A] focus:ring-2 focus:ring-[#C97C2A]/20 md:w-[220px]"
              />
            </label>
          </div>

          {error && <div className="error-callout mb-4">{error}</div>}

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="skeleton-shimmer h-[94px] rounded-lg border border-[#E8E1D6]"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-[#E8E1D6] bg-white px-6 py-14 text-center">
              <h2 className="font-serif text-3xl">No generations yet</h2>
              <p className="mt-2 text-sm text-[#7A756A]">
                Start by uploading your first document.
              </p>
              <Link
                href="/upload"
                className="mt-5 inline-flex rounded-lg bg-[#0F0E0C] px-4 py-2.5 text-sm text-[#FAF8F4]"
              >
                Go to upload
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => (
                <Link
                  key={item._id}
                  href={`/dashboard/${item._id}`}
                  className="grid grid-cols-[36px_1fr_auto] items-center gap-4 rounded-lg border border-[#E8E1D6] bg-white p-4 transition hover:border-[#B5B0A5]"
                >
                  <TypeBadge type={item.generationType} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0F0E0C]">
                      {item.userGivenName || "Untitled generation"}
                    </p>
                    <p className="truncate font-mono text-[11px] uppercase tracking-[0.08em] text-[#B5B0A5]">
                      {item.fileName}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-[#7A756A]">
                      {item.generatedContent}
                    </p>
                  </div>
                  <p className="text-right font-mono text-[11px] uppercase tracking-[0.08em] text-[#B5B0A5]">
                    {formatDistanceToNow(new Date(item.uploadDate), {
                      addSuffix: true,
                    })}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
