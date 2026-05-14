"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const MUTE_KEY = "bbx_invite_music_muted_v1";
const SCROLL_TRIGGER_PX = 480;
const WHATSAPP_NUMBER = "919971797740"; // +91 99717 97740
const WHATSAPP_MESSAGE =
  "Hi BlinkBox Studio! I'd love to know more about Collaborative Forge at designPOV (15–17 May 2026).";

const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

/**
 * Path to the invite artwork. Drop the image at:
 *   public/event-invite.jpeg
 */
const INVITE_IMAGE_SRC = "/event-invite.jpeg";

/**
 * Path to the background music. Drop a soft instrumental track at:
 *   public/invite-music.mp3
 * (Or change the extension here to match .ogg / .m4a.)
 */
const MUSIC_SRC = "/invite-music.mp3";
const TARGET_VOLUME = 0.3; // soft
const FADE_IN_MS = 1500;
const FADE_OUT_MS = 700;

export default function EventInvite() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [imageMissing, setImageMissing] = useState(false);
  const [muted, setMuted] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRaf = useRef<number | null>(null);

  // hydrate mute preference
  useEffect(() => {
    try {
      if (localStorage.getItem(MUTE_KEY) === "1") setMuted(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let triggered = false;
    const handleScroll = () => {
      if (triggered) return;
      if (window.scrollY > SCROLL_TRIGGER_PX) {
        triggered = true;
        setOpen(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- audio fade helper ---
  const fadeVolume = (
    from: number,
    to: number,
    duration: number,
    onDone?: () => void
  ) => {
    const audio = audioRef.current;
    if (!audio) {
      onDone?.();
      return;
    }
    if (fadeRaf.current) cancelAnimationFrame(fadeRaf.current);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      audio.volume = from + (to - from) * t;
      if (t < 1) {
        fadeRaf.current = requestAnimationFrame(tick);
      } else {
        fadeRaf.current = null;
        onDone?.();
      }
    };
    fadeRaf.current = requestAnimationFrame(tick);
  };

  // start / stop music when the popup opens or closes (and respects mute)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (open && !muted) {
      audio.volume = 0;
      audio.currentTime = 0;
      const p = audio.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          setAudioBlocked(false);
          fadeVolume(0, TARGET_VOLUME, FADE_IN_MS);
        }).catch(() => {
          // browser blocked autoplay — user can tap the speaker to start
          setAudioBlocked(true);
        });
      }
    } else if (!open && !audio.paused) {
      fadeVolume(audio.volume, 0, FADE_OUT_MS, () => {
        audio.pause();
        audio.currentTime = 0;
      });
    }
  }, [open, muted]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeRaf.current) cancelAnimationFrame(fadeRaf.current);
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    const next = !muted;
    setMuted(next);
    try {
      localStorage.setItem(MUTE_KEY, next ? "1" : "0");
    } catch {}
    if (!audio) return;
    if (next) {
      // muting
      fadeVolume(audio.volume, 0, 400, () => audio.pause());
    } else {
      // unmuting
      audio.volume = 0;
      const p = audio.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          setAudioBlocked(false);
          fadeVolume(0, TARGET_VOLUME, 800);
        }).catch(() => setAudioBlocked(true));
      }
    }
  };

  const close = () => {
    setOpen(false);
    setDismissed(true);
  };

  if (dismissed && !open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="invite-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[180] flex items-center justify-center p-3 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            onClick={close}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Card + creatures wrapper */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 40, rotate: -1.2 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24, rotate: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 22,
              opacity: { duration: 0.35 },
            }}
            className="relative w-full max-w-[940px] max-h-[95vh] flex flex-col items-center"
          >
            {/* Flying creatures escape OUTSIDE the card */}
            <FlyingCreatures />

            {/* Audio element — looped, soft, fade-controlled in JS */}
            <audio
              ref={audioRef}
              src={MUSIC_SRC}
              loop
              preload="auto"
              playsInline
              aria-hidden
            />

            {/* The invite image itself */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.55)] bg-[#fbf3df]">
              {/* Mute / unmute toggle */}
              <button
                onClick={toggleMute}
                aria-label={muted ? "Unmute background music" : "Mute background music"}
                title={muted ? "Play music" : "Mute music"}
                className="absolute top-3 left-3 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-white/85 hover:bg-white text-black/70 hover:text-black shadow-lg transition-colors"
              >
                {muted ? <SpeakerMutedIcon /> : <SpeakerOnIcon />}
                {!muted && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      boxShadow: "0 0 0 0 rgba(237,121,89,0.6)",
                    }}
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(237,121,89,0.55)",
                        "0 0 0 10px rgba(237,121,89,0)",
                      ],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}
              </button>

              {/* Tap-to-play hint when browser blocked autoplay */}
              <AnimatePresence>
                {audioBlocked && !muted && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-4 left-16 z-20 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] text-black/70 shadow"
                  >
                    Tap to play music
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Close button */}
              <button
                onClick={close}
                aria-label="Close invite"
                className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-white/85 hover:bg-white text-black/70 hover:text-black shadow-lg transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M3 3 L15 15 M15 3 L3 15"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {/* The artwork */}
              {!imageMissing ? (
                <img
                  src={INVITE_IMAGE_SRC}
                  alt="BLINKBOX x designPOV — Collaborative Forge invitation"
                  className="block w-full h-auto max-h-[78vh] object-contain"
                  draggable={false}
                  onError={() => setImageMissing(true)}
                />
              ) : (
                <MissingImageState src={INVITE_IMAGE_SRC} />
              )}
            </div>

            {/* Floating CTA below the image */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 -mt-7 sm:-mt-9 w-[min(92%,420px)]"
            >
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block w-full overflow-hidden rounded-full text-center text-white py-4 shadow-[0_18px_40px_rgba(37,211,102,0.55)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: "#25D366" }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3 font-semibold">
                  <WhatsAppIcon />
                  <span className="tracking-[0.22em] uppercase text-sm">
                    Enquire Now
                  </span>
                  <span className="text-lg transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
                {/* sheen */}
                <span
                  className="absolute inset-y-0 w-1/3 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
                  }}
                />
              </a>
              <div className="mt-3 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/70">
                <span>+91 99717 97740</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>WhatsApp</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MissingImageState({ src }: { src: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center px-8 py-16 sm:py-24"
      style={{
        background:
          "repeating-linear-gradient(45deg, #fbf3df 0 20px, #f5ead0 20px 40px)",
        color: "#2f2a25",
        minHeight: 420,
      }}
    >
      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-5 shadow-md">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="#d94350" strokeWidth="1.6"/>
          <circle cx="9" cy="11" r="1.5" fill="#d94350"/>
          <path d="M21 16 L16 11 L9 18 L3 14" stroke="#d94350" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
        </svg>
      </div>
      <h3 className="font-display text-xl sm:text-2xl mb-3">
        Drop the invite image here
      </h3>
      <p className="text-sm text-black/65 max-w-md leading-relaxed mb-5">
        Save the artwork to your project so the popup can show it. Expected path:
      </p>
      <code className="text-[12px] sm:text-sm font-mono bg-black/[0.06] text-black/85 px-3 py-2 rounded-md border border-black/10 break-all">
        public{src}
      </code>
      <p className="mt-5 text-[11px] text-black/45 max-w-md leading-relaxed">
        If your file is a <code className="font-mono">.jpg</code> or
        <code className="font-mono"> .webp</code>, rename the extension here or
        edit <code className="font-mono">INVITE_IMAGE_SRC</code> at the top of
        <code className="font-mono"> components/EventInvite.tsx</code>.
      </p>
    </div>
  );
}

function SpeakerOnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 9 L4 15 L8 15 L13 19 L13 5 L8 9 Z"
        fill="currentColor"
      />
      <path
        d="M16 9 C 17.5 10 17.5 14 16 15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M18.5 7 C 21 9 21 15 18.5 17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function SpeakerMutedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 9 L4 15 L8 15 L13 19 L13 5 L8 9 Z"
        fill="currentColor"
      />
      <path
        d="M16 9 L21 14 M21 9 L16 14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.587-3.849-1.587-5.946C.16 5.335 5.495 0 12.05 0c3.181 0 6.167 1.24 8.413 3.488 2.245 2.248 3.48 5.236 3.48 8.414 0 6.557-5.335 11.892-11.893 11.892-1.99 0-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    </svg>
  );
}

/* ----------------------- flying creatures ----------------------- */

function FlyingCreatures() {
  // Each creature originates near the popup edges and drifts outward.
  // Positions are relative to the wrapper, with overflow:visible so they
  // escape the card into the surrounding dark space.
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: "visible" }}
    >
      {/* Butterflies — emerging from corners + edges */}
      <Butterfly
        from={{ left: "8%", top: "0%" }}
        path={{ x: [-10, -90, -160], y: [-10, -90, -180] }}
        color1="#ed7959"
        color2="#d94350"
        size={22}
        delay={0.4}
        duration={6}
      />
      <Butterfly
        from={{ right: "8%", top: "0%" }}
        path={{ x: [10, 100, 170], y: [-10, -80, -170] }}
        color1="#8b5fbf"
        color2="#d94350"
        size={20}
        delay={0.7}
        duration={6.8}
      />
      <Butterfly
        from={{ left: "6%", bottom: "20%" }}
        path={{ x: [-10, -90, -150], y: [10, 70, 140] }}
        color1="#2a4cab"
        color2="#8b5fbf"
        size={18}
        delay={1.0}
        duration={7.4}
      />
      <Butterfly
        from={{ right: "6%", bottom: "20%" }}
        path={{ x: [10, 100, 170], y: [10, 80, 150] }}
        color1="#ed7959"
        color2="#8b5fbf"
        size={24}
        delay={1.3}
        duration={6.2}
      />
      <Butterfly
        from={{ left: "42%", top: "-3%" }}
        path={{ x: [0, -50, 60], y: [-15, -130, -220] }}
        color1="#d94350"
        color2="#ed7959"
        size={16}
        delay={1.7}
        duration={7}
      />
      <Butterfly
        from={{ left: "70%", top: "10%" }}
        path={{ x: [40, 120, 200], y: [-20, -90, -150] }}
        color1="#8b5fbf"
        color2="#2a4cab"
        size={17}
        delay={2.0}
        duration={6.5}
      />

      {/* Ladybugs — scuttling around the card */}
      <Ladybug
        from={{ left: "4%", top: "32%" }}
        path={{ x: [-8, -50, -80, -120], y: [0, -12, 14, -6] }}
        delay={0.9}
        duration={9}
      />
      <Ladybug
        from={{ right: "4%", top: "48%" }}
        path={{ x: [8, 50, 90, 130], y: [0, 10, -10, 6] }}
        delay={1.4}
        duration={10}
      />
      <Ladybug
        from={{ left: "28%", bottom: "8%" }}
        path={{ x: [0, -25, 35, 15], y: [10, 60, 100, 150] }}
        delay={2.0}
        duration={8.5}
      />
      <Ladybug
        from={{ right: "30%", bottom: "5%" }}
        path={{ x: [0, 25, -10, 30], y: [10, 70, 110, 160] }}
        delay={2.6}
        duration={9.5}
      />
    </div>
  );
}

function Butterfly({
  from,
  path,
  color1,
  color2,
  size = 20,
  delay = 0,
  duration = 6,
}: {
  from: React.CSSProperties;
  path: { x: number[]; y: number[] };
  color1: string;
  color2: string;
  size?: number;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className="absolute"
      style={from}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0.6, 0],
        scale: [0, 1, 1, 0.95, 0.7],
        x: [0, ...path.x],
        y: [0, ...path.y],
        rotate: [0, -12, 8, -6, 4],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <ButterflyShape size={size} color1={color1} color2={color2} />
    </motion.div>
  );
}

function ButterflyShape({
  size,
  color1,
  color2,
}: {
  size: number;
  color1: string;
  color2: string;
}) {
  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 24 20"
      aria-hidden
      style={{ overflow: "visible" }}
    >
      {/* Left wing */}
      <motion.path
        d="M 12 10 C 8 4 3 3 1 6 C -1 9 1 14 5 15 C 8 16 11 13 12 10 Z"
        fill={color1}
        opacity="0.92"
        animate={{ scaleX: [1, 0.35, 1] }}
        transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "12px 10px" }}
      />
      {/* Right wing */}
      <motion.path
        d="M 12 10 C 16 4 21 3 23 6 C 25 9 23 14 19 15 C 16 16 13 13 12 10 Z"
        fill={color2}
        opacity="0.92"
        animate={{ scaleX: [1, 0.35, 1] }}
        transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "12px 10px" }}
      />
      {/* Lower wings */}
      <motion.ellipse
        cx="7"
        cy="15"
        rx="3"
        ry="2"
        fill={color1}
        opacity="0.6"
        animate={{ scaleX: [1, 0.5, 1] }}
        transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "12px 15px" }}
      />
      <motion.ellipse
        cx="17"
        cy="15"
        rx="3"
        ry="2"
        fill={color2}
        opacity="0.6"
        animate={{ scaleX: [1, 0.5, 1] }}
        transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "12px 15px" }}
      />
      {/* Body */}
      <ellipse cx="12" cy="11" rx="1" ry="5" fill="#2f2a25" />
      {/* Antennae */}
      <path
        d="M 12 6 C 11 4 10 3 9 2.5 M 12 6 C 13 4 14 3 15 2.5"
        stroke="#2f2a25"
        strokeWidth="0.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function Ladybug({
  from,
  path,
  delay = 0,
  duration = 8,
}: {
  from: React.CSSProperties;
  path: { x: number[]; y: number[] };
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className="absolute"
      style={from}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 1, 0],
        scale: [0, 1, 1, 1, 0.7],
        x: [0, ...path.x],
        y: [0, ...path.y],
        rotate: [0, 15, -10, 18, -5],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <LadybugShape />
    </motion.div>
  );
}

function LadybugShape() {
  return (
    <svg width="16" height="13" viewBox="0 0 16 13" aria-hidden>
      <circle cx="8" cy="2.4" r="2" fill="#1a1410" />
      <ellipse cx="8" cy="7.5" rx="5.5" ry="4.4" fill="#d94350" />
      <rect x="7.6" y="3.5" width="0.8" height="8" fill="#1a1410" />
      <circle cx="5.2" cy="6" r="0.9" fill="#1a1410" />
      <circle cx="10.8" cy="6" r="0.9" fill="#1a1410" />
      <circle cx="5.5" cy="9.4" r="0.8" fill="#1a1410" />
      <circle cx="10.5" cy="9.4" r="0.8" fill="#1a1410" />
      <ellipse cx="6.5" cy="5.5" rx="1.3" ry="0.8" fill="rgba(255,255,255,0.35)" />
    </svg>
  );
}
