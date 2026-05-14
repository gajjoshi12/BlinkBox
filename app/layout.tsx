import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import TemperatureProvider from "@/components/TemperatureProvider";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BLINK BOX STUDIO — Bespoke Architectural Lighting",
  description:
    "Bespoke pendants, centrepieces, and volumetric lighting installations. Designed, fabricated and commissioned in-house from our Bengaluru workshop.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#07060b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="noise">
        <TemperatureProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </TemperatureProvider>
      </body>
    </html>
  );
}
