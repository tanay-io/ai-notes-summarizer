"use client";

import { useEffect } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const enabled = storedTheme === "dark" || (!storedTheme && prefersDark);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  return children;
}
