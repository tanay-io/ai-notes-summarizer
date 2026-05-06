import Link from "next/link";

type PlaceholderPageProps = {
  label: string;
  title: string;
  description: string;
};

export function PlaceholderPage({
  label,
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-[#FAF8F4] px-4 py-14">
      <div className="mx-auto w-full max-w-[900px] rounded-xl border border-[#E8E1D6] bg-white p-8 md:p-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#C97C2A]">
          {label}
        </p>
        <h1 className="mt-2 text-4xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-[#7A756A]">{description}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-lg border border-[#E8E1D6] bg-white px-4 py-2.5 text-sm text-[#3A3832] transition hover:border-[#B5B0A5]"
          >
            Back to home
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-lg bg-[#0F0E0C] px-4 py-2.5 text-sm text-[#FAF8F4] transition hover:bg-[#3A3832]"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
