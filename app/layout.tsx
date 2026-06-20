import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// PP Neue Machina — the site's primary typeface (display + body).
// Plain family ships Light / Regular / Ultrabold; Ultrabold is mapped to 700
// so any bold/semibold request resolves to it.
const machina = localFont({
  src: [
    { path: "../fonts/machina/PPNeueMachina-Light.otf", weight: "300", style: "normal" },
    { path: "../fonts/machina/PPNeueMachina-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/machina/PPNeueMachina-Ultrabold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

const machinaDisplay = localFont({
  src: [
    { path: "../fonts/machina/PPNeueMachina-Ultrabold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NinetyNile — Creativity, Overflowing.",
  description:
    "NinetyNile is a boutique creative communication consultancy and content creation agency. Originally from where the two Niles meet.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${machina.variable} ${machinaDisplay.variable}`}>
      <body>{children}</body>
    </html>
  );
}
