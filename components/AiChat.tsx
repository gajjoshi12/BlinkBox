"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, FormEvent } from "react";

type Message = {
  id: number;
  role: "ai" | "user";
  text: string;
};

/* ——— Lumi avatar — Siri-style liquid orb ———
   Two iridescent radial gradients drift across each other on a blurred
   conic halo, capped by a glass highlight. When `thinking`, every layer
   speeds up and the halo pulses — so the avatar feels alive while
   the AI is "responding."                                              */
function LumiAvatar({
  size = 36,
  thinking = false,
}: {
  size?: number;
  thinking?: boolean;
}) {
  const haloSpeed = thinking ? 3.2 : 9;
  const blobSpeed = thinking ? 2.4 : 5.5;
  const blobSpeed2 = thinking ? 2.8 : 6.5;
  const breathSpeed = thinking ? 1.2 : 3;

  return (
    <motion.div
      className="relative rounded-full"
      style={{ width: size, height: size }}
      animate={{ scale: thinking ? [1, 1.06, 1] : [1, 1.02, 1] }}
      transition={{
        duration: breathSpeed,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* outer halo — soft brand-colored glow that rotates */}
      <motion.div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: `-${Math.round(size * 0.18)}px`,
          background:
            "conic-gradient(from 0deg, #ed7959, #d94350, #8b5fbf, #2a4cab, #ed7959)",
          filter: `blur(${size * 0.18}px)`,
          opacity: thinking ? 0.85 : 0.55,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: haloSpeed, repeat: Infinity, ease: "linear" }}
      />

      {/* glass marble — clips the liquid inside */}
      <div className="absolute inset-0 rounded-full overflow-hidden border border-white/25 shadow-[inset_0_0_8px_rgba(0,0,0,0.4)]">
        {/* base wash — deep brand bed */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 60%, #2a4cab 0%, #1a0f2e 100%)",
          }}
        />

        {/* liquid blob A — warm side, drifts in one orbit */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "150%",
            height: "150%",
            left: "-25%",
            top: "-25%",
            background:
              "radial-gradient(circle, #ffd9c8 0%, #ed7959 28%, rgba(217,67,80,0.6) 55%, transparent 75%)",
            filter: `blur(${Math.max(2, size * 0.06)}px)`,
            mixBlendMode: "screen",
          }}
          animate={{
            x: ["-12%", "8%", "-6%", "10%", "-12%"],
            y: ["-8%", "10%", "12%", "-10%", "-8%"],
            scale: [1, 1.15, 0.92, 1.1, 1],
          }}
          transition={{
            duration: blobSpeed,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* liquid blob B — cool side, counter-orbit */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "150%",
            height: "150%",
            left: "-25%",
            top: "-25%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.4) 0%, #8b5fbf 25%, rgba(42,76,171,0.7) 55%, transparent 78%)",
            filter: `blur(${Math.max(2, size * 0.06)}px)`,
            mixBlendMode: "screen",
          }}
          animate={{
            x: ["10%", "-12%", "8%", "-10%", "10%"],
            y: ["8%", "-10%", "-14%", "12%", "8%"],
            scale: [1, 0.9, 1.18, 0.95, 1],
          }}
          transition={{
            duration: blobSpeed2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* core highlight — bright wandering eye */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "55%",
            height: "55%",
            left: "22%",
            top: "18%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,217,200,0.4) 40%, transparent 70%)",
            filter: `blur(${Math.max(1, size * 0.04)}px)`,
            mixBlendMode: "screen",
          }}
          animate={{
            x: ["0%", "12%", "-8%", "4%", "0%"],
            y: ["0%", "-6%", "10%", "-4%", "0%"],
            opacity: thinking ? [0.7, 1, 0.7] : [0.5, 0.9, 0.5],
          }}
          transition={{
            duration: thinking ? 1.6 : 3.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* specular — fixed glass shine, sells the marble feel */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: 0,
            background:
              "radial-gradient(ellipse 50% 35% at 30% 22%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 60%)",
          }}
        />
      </div>
    </motion.div>
  );
}

const SUGGESTIONS = [
  "What do you make?",
  "Lead time for a custom pendant?",
  "Do you ship internationally?",
  "Book a studio visit",
];

const SEED: Message = {
  id: 0,
  role: "ai",
  text:
    "Hi — I'm Lumi, the Blink Box light concierge. Tell me about the room you're lighting, and I'll point you in the right direction.",
};

// tiny canned-response engine — keeps the demo feeling alive without a backend
function reply(input: string): string {
  const q = input.toLowerCase();
  if (/\b(price|cost|budget|quote|how much)\b/.test(q))
    return "Each commission is priced to the piece — typically ₹85k for a small bespoke pendant up to multi-lakh installations for atrium centrepieces. Share the room dimensions and I'll get a studio lead to scope it.";
  if (/\b(lead time|how long|when|deliver|ship)\b/.test(q))
    return "Custom pieces take 6–10 weeks from sign-off — we hand-blow the glass and finish the brass in our Bengaluru workshop. International shipping is crated and insured.";
  if (/\b(visit|studio|showroom|appointment|book|meet)\b/.test(q))
    return "We host private studio visits Tue–Sat. Drop your city and a window that suits, and the team will confirm a slot within 24 hours.";
  if (/\b(material|brass|glass|finish|wood)\b/.test(q))
    return "Our standard palette is hand-blown borosilicate, brushed brass, blackened steel, and ceramic. Custom finishes — patinas, frosted optics, dichroic glass — are all on the table.";
  if (/\b(make|do|offer|service|product)\b/.test(q))
    return "Three streams: bespoke pendants, architectural centrepieces, and volumetric installations for atriums and lobbies. Everything is designed and fabricated in-house.";
  if (/\b(contact|email|phone|call|reach)\b/.test(q))
    return "Easiest is connect@blinkboxstudio.in or +91 99717 97740 — or drop your brief in the form below and a designer will reply within 48 hours.";
  if (/\b(hi|hello|hey|namaste)\b/.test(q))
    return "Hello — lovely to have you here. What kind of space are we lighting today?";
  return "Good question — let me get a designer to weigh in. In the meantime, share a few details about the space (ceiling height, mood, scale) and I'll pre-brief the team.";
}

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([SEED]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // auto-scroll on new message
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  // focus input when opened, clear unread badge
  useEffect(() => {
    if (open) {
      setUnread(false);
      const t = setTimeout(() => inputRef.current?.focus(), 320);
      return () => clearTimeout(t);
    }
  }, [open]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    const userMsg: Message = { id: Date.now(), role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    // simulated thinking — feels human, not instant
    const delay = 600 + Math.min(1600, trimmed.length * 18);
    window.setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: reply(trimmed),
      };
      setMessages((m) => [...m, aiMsg]);
      setTyping(false);
    }, delay);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50 select-none">
      {/* ——— Floating launcher ——— */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 2.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            data-cursor="hover"
            aria-label="Open Lumi — light concierge"
            className="group relative flex items-center gap-3 rounded-full pl-2 pr-5 py-2 border border-white/12 bg-black/50 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:border-white/25 transition-colors"
          >
            <LumiAvatar size={32} />

            <span className="flex flex-col items-start leading-tight">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">
                Ask
              </span>
              <span className="font-mono text-sm text-white/90">Lumi</span>
            </span>

            {unread && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, #ed7959 0%, #d94350 100%)",
                  boxShadow: "0 0 12px #ed7959",
                }}
              >
                <motion.span
                  className="absolute inset-0 rounded-full"
                  animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  style={{ background: "#ed7959" }}
                />
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ——— Chat panel ——— */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-[calc(100vw-2rem)] max-w-[380px] rounded-2xl border border-white/12 bg-black/70 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.75)] overflow-hidden"
          >
            {/* ambient glow blob */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-30 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, #ed7959 0%, #8b5fbf 60%, transparent 100%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -right-16 w-64 h-64 rounded-full opacity-25 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, #2a4cab 0%, #d94350 60%, transparent 100%)",
              }}
            />

            {/* header */}
            <div className="relative flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/8">
              <div className="flex items-center gap-3">
                <LumiAvatar size={44} thinking={typing} />
                <div className="flex flex-col leading-tight">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">
                    Light Concierge
                  </span>
                  <span className="font-display text-lg text-white/95 -mt-0.5">
                    Lumi
                    <span className="ml-2 inline-block align-middle w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
                  </span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/40 hover:text-white text-xs uppercase tracking-[0.2em] transition-colors"
                aria-label="Close chat"
                data-cursor="hover"
              >
                ✕
              </button>
            </div>

            {/* messages */}
            <div
              ref={scrollRef}
              data-lenis-prevent
              className="relative px-5 py-4 h-[340px] overflow-y-auto space-y-3 ai-chat-scroll"
            >
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                        m.role === "user"
                          ? "rounded-br-sm text-white border border-white/15"
                          : "rounded-bl-sm text-white/90 border border-white/8 bg-white/[0.03]"
                      }`}
                      style={
                        m.role === "user"
                          ? {
                              background:
                                "linear-gradient(135deg, rgba(237,121,89,0.22) 0%, rgba(217,67,80,0.22) 50%, rgba(139,95,191,0.22) 100%)",
                            }
                          : undefined
                      }
                    >
                      {m.text}
                    </div>
                  </motion.div>
                ))}

                {typing && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm border border-white/8 bg-white/[0.03] flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background:
                              i === 0
                                ? "#ed7959"
                                : i === 1
                                ? "#d94350"
                                : "#8b5fbf",
                          }}
                          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* suggestions — only visible on first turn */}
            {messages.length === 1 && !typing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative px-5 pb-3 flex flex-wrap gap-1.5"
              >
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={s}
                    onClick={() => send(s)}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.06 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    data-cursor="hover"
                    className="text-[10px] uppercase tracking-[0.18em] px-2.5 py-1.5 rounded-full border border-white/10 hover:border-[rgb(var(--lamp-glow))] text-white/60 hover:text-white transition-colors"
                  >
                    {s}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* input */}
            <form
              onSubmit={onSubmit}
              className="relative flex items-center gap-2 px-3 py-3 border-t border-white/8 bg-black/30"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your space…"
                className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/30 focus:outline-none px-2"
                maxLength={400}
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || typing}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                data-cursor="hover"
                aria-label="Send"
                className="relative w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                style={{
                  background:
                    "linear-gradient(135deg, #ed7959 0%, #d94350 50%, #8b5fbf 100%)",
                  boxShadow: "0 4px 18px rgba(217,67,80,0.45)",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </motion.button>
            </form>

            <div className="px-5 pb-3 text-[9px] uppercase tracking-[0.25em] text-white/25 text-center">
              Lumi is a guide · a designer follows up within 48h
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* scrollbar styling */}
      <style jsx global>{`
        .ai-chat-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .ai-chat-scroll::-webkit-scrollbar-thumb {
          background: rgba(237, 121, 89, 0.25);
          border-radius: 4px;
        }
        .ai-chat-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(237, 121, 89, 0.45);
        }
      `}</style>
    </div>
  );
}
