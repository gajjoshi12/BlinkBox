import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import Cursor from "@/components/Cursor";
import DustMotes from "@/components/DustMotes";
import AiChat from "@/components/AiChat";

export const metadata: Metadata = {
  title: "Our People — BLINK BOX STUDIO",
  description:
    "The hands behind the light — the designers, engineers, and workshop crew of Blink Box Studio, Bengaluru.",
};

export default function TeamPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(237,121,89,0.10), transparent 70%), var(--bg-deep)",
        }}
      />
      <DustMotes />

      <Navigation />
      <ScrollProgress />
      <Cursor />

      <div className="relative z-10 pt-16 md:pt-20">
        <Team />
        <Footer />
      </div>

      <AiChat />
    </main>
  );
}
