import type { Metadata } from "next";
import { DM_Mono, DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./ThemeProvider";
import { SessionProvider } from "./SessionProvider";
import { PageTransition } from "@/components/layout/PageTransition";

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "NoteWhiz",
  description: "Document intelligence with warm editorial UX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${instrumentSerif.variable} ${dmSans.variable} ${dmMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProvider>
          <ThemeProvider>
            <PageTransition>{children}</PageTransition>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
