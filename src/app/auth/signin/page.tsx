"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      setError("Invalid username or password.");
      setIsLoading(false);
      return;
    }

    router.push("/upload");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] p-4 md:p-10">
      <div className="mx-auto grid min-h-[580px] w-full max-w-[1100px] overflow-hidden rounded-xl border border-[#E8E1D6] bg-white md:grid-cols-2">
        <aside className="relative hidden bg-[#0F0E0C] p-10 text-[#FAF8F4] md:block">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-[-80px] top-[-60px] h-56 w-56 rounded-full bg-white/10" />
            <div className="absolute bottom-[-60px] right-[-30px] h-52 w-52 rounded-full bg-white/10" />
          </div>

          <div className="relative z-10">
            <p className="text-xl">
              <span className="font-serif italic">Note</span>
              <span className="font-serif text-[#E8952F]">Whiz</span>
            </p>
            <h1 className="mt-10 font-serif text-5xl leading-tight">
              Welcome back.
            </h1>
            <p className="mt-4 max-w-sm text-white/70">
              Continue from where you left off. Your uploads, generations, and
              dashboard history are ready.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-white/75">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E8952F]" />{" "}
                Structured summaries
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E8952F]" />{" "}
                Flashcards and key points
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E8952F]" />{" "}
                Editable generation library
              </li>
            </ul>
          </div>
        </aside>

        <section className="flex items-center justify-center bg-[#FAF8F4] p-8 md:p-12">
          <div className="w-full max-w-[360px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#C97C2A]">
              Sign in
            </p>
            <h2 className="mt-2 font-serif text-4xl">Access your workspace</h2>
            <p className="mt-2 text-sm text-[#7A756A]">
              Use your NoteWhiz credentials.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm text-[#3A3832]"
                >
                  Username
                </label>
                <input
                  id="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                  className="w-full rounded-lg border border-[#E8E1D6] bg-white px-3 py-2.5 text-sm text-[#0F0E0C] placeholder:text-[#B5B0A5] outline-none transition focus:border-[#C97C2A] focus:ring-2 focus:ring-[#C97C2A]/20"
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm text-[#3A3832]">
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-[#C97C2A] hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full rounded-lg border border-[#E8E1D6] bg-white px-3 py-2.5 text-sm text-[#0F0E0C] placeholder:text-[#B5B0A5] outline-none transition focus:border-[#C97C2A] focus:ring-2 focus:ring-[#C97C2A]/20"
                />
              </div>

              {error && <div className="error-callout">{error}</div>}

              <button
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F0E0C] px-4 py-3 text-sm text-[#FAF8F4] transition hover:bg-[#3A3832] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                  </>
                ) : (
                  <>
                    Sign in <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-sm text-[#7A756A]">
              No account yet?{" "}
              <Link
                href="/auth/signup"
                className="text-[#C97C2A] hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
