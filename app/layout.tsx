import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NinetyNile",
  description: "Creativity, Overflowing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
