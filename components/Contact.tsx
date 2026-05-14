"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Magnetic from "./Magnetic";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="relative py-20 md:py-32 px-5 md:px-6">
      <div className="relative z-10 mx-auto max-w-[1400px] grid md:grid-cols-12 gap-12">
        {/* Left — large statement */}
        <div className="md:col-span-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
              N°09
            </span>
            <span className="h-px w-12 bg-white/15" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Start a Conversation
            </span>
          </div>
          <h2 className="font-display font-extralight text-[clamp(2.4rem,6vw,5.5rem)] leading-[1] mb-10">
            <span className="block">Say</span>
            <span className="block italic gradient-temp">hello.</span>
          </h2>
          <p className="text-white/55 max-w-md leading-relaxed mb-12">
            We take on a small number of commissions each year. Tell us about
            the room — the architecture, the volume, the hours it will be
            lived in — and the kind of light it is asking for.
          </p>

          <div className="space-y-6 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-2">
                Workshop
              </div>
              <div className="text-white/80">
                Blinkbox Studio Pvt Ltd
                <br />
                Bengaluru, India
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-2">
                Direct
              </div>
              <a
                href="mailto:connect@blinkboxstudio.in"
                className="text-white/90 hover:text-[rgb(var(--lamp-glow))] transition-colors block"
              >
                connect@blinkboxstudio.in
              </a>
              <a
                href="tel:+919971797740"
                className="text-white/90 hover:text-[rgb(var(--lamp-glow))] transition-colors block mt-1"
              >
                +91 99717 97740
              </a>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-2">
                Online
              </div>
              <a
                href="https://www.blinkboxlighting.com"
                target="_blank"
                rel="noreferrer"
                className="text-white/90 hover:text-[rgb(var(--lamp-glow))] transition-colors"
              >
                www.blinkboxlighting.com
              </a>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="md:col-span-6">
          <motion.form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative bg-black/20 border border-white/8 backdrop-blur-sm p-10 md:p-12 rounded-sm"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-[rgb(var(--lamp-glow))]/15"
                >
                  <span className="w-3 h-3 rounded-full bg-[rgb(var(--lamp-glow))] shadow-[0_0_24px_rgb(var(--lamp-glow))]" />
                </motion.div>
                <h3 className="font-display text-3xl text-white/95 mb-3">
                  Got it.
                </h3>
                <p className="text-white/55 text-sm max-w-sm mx-auto">
                  Your note has landed. We'll reply within two working days — usually faster.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-8">
                <Field label="Your name" name="name" />
                <Field label="Email" name="email" type="email" />
                <Field label="Project site / city" name="location" />
                <SelectField
                  label="Type of commission"
                  name="type"
                  options={[
                    "Bespoke Pendant",
                    "Architectural Centrepiece",
                    "Atrium / Volumetric Install",
                    "Custom Chandelier",
                    "Material R&D",
                    "Other",
                  ]}
                />
                <Field label="Tell us about the project" name="message" textarea />

                <Magnetic strength={14} className="w-full">
                  <button
                    type="submit"
                    className="group relative w-full overflow-hidden border border-white/15 hover:border-[rgb(var(--lamp-glow))] transition-colors px-8 py-5 text-[11px] uppercase tracking-[0.3em] text-white"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Send the brief
                      <span className="block h-px w-12 bg-white group-hover:w-20 transition-all duration-500" />
                    </span>
                    <span
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(var(--lamp-glow), 0.18), transparent)",
                      }}
                    />
                  </button>
                </Magnetic>
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 text-center">
                  Replies within 48 hours · NDA on request
                </p>
              </div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea = false,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
}) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <label className="block group">
      <span className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 group-focus-within:text-[rgb(var(--lamp-glow))] transition-colors">
        {label}
      </span>
      <div className="relative">
        <Tag
          name={name}
          type={type}
          rows={textarea ? 4 : undefined}
          required
          className="w-full bg-transparent border-b border-white/10 group-focus-within:border-[rgb(var(--lamp-glow))] transition-colors py-3 text-white placeholder:text-white/30 focus:outline-none resize-none"
        />
      </div>
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label className="block group">
      <span className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 group-focus-within:text-[rgb(var(--lamp-glow))] transition-colors">
        {label}
      </span>
      <select
        name={name}
        required
        className="w-full bg-transparent border-b border-white/10 group-focus-within:border-[rgb(var(--lamp-glow))] transition-colors py-3 text-white focus:outline-none"
      >
        <option value="" className="bg-[#07060b]">
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#07060b]">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
