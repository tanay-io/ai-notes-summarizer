import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./ThemeProvider"; // 👈 Import it here
import { SessionProvider } from "./SessionProvider"; // IMPORT FROM YOUR CUSTOM CLIENT-SIDE PROVIDER!

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Notes Summariser",
  description: "Transform your documents into actionable insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300`}
      >
        {/* Correct nesting: SessionProvider wraps everything that needs session */}
        <SessionProvider>
          {/* ThemeProvider also wraps the children within the session context */}
          <ThemeProvider>{children}</ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}