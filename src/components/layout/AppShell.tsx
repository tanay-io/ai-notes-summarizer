"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FileUp, LayoutDashboard, LogOut } from "lucide-react";

type AppShellProps = {
  children: React.ReactNode;
};

function NavItem({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-[5px] px-3 py-2 text-sm transition-all ${
        active
          ? "bg-white/10 text-[#FAF8F4]"
          : "text-white/55 hover:bg-white/10 hover:text-white/90"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[220px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col bg-[#0F0E0C] p-6 md:flex">
        <Link href="/" className="mb-8 text-[1.2rem] text-[#FAF8F4]">
          <span className="font-serif italic">Note</span>
          <span className="font-serif text-[#E8952F]">Whiz</span>
        </Link>

        <p className="mb-2 px-2 font-mono text-[11px] uppercase tracking-[0.08em] text-white/25">
          Workspace
        </p>

        <div className="space-y-1">
          <NavItem
            href="/dashboard"
            label="Dashboard"
            icon={<LayoutDashboard className="h-4 w-4" />}
          />
          <NavItem href="/upload" label="Upload" icon={<FileUp className="h-4 w-4" />} />
        </div>

        <button
          onClick={() => signOut()}
          className="mt-auto flex items-center gap-2 rounded-[5px] px-3 py-2 text-left text-sm text-white/55 transition-all hover:bg-white/10 hover:text-white/90"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>

      <main className="min-h-screen bg-[#FAF8F4]">{children}</main>
    </div>
  );
}
