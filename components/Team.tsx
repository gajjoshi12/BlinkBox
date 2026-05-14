"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type Person = {
  name: string;
  /** stable key */
  slug: string;
  /** filename in /public/team — omit for the monogram fallback */
  photo?: string;
  /** the witty bio lines, verbatim from the studio deck */
  lines: string[];
};

/* Order & wording kept faithful to the "Our People" deck.
   Photos live in /public/team — copied from the root-folder originals. */
const PEOPLE: Person[] = [
  {
    name: "Girish Bhardwaj",
    slug: "girish-bhardwaj",
    photo: "girish-bhardwaj.jpg",
    lines: [
      "Visionary, half doctor, half consultant, full lighting enthusiast",
      "Too much he talks",
      "Our own Shashi Tharoor",
      "Has a dictionary of his own",
    ],
  },
  {
    name: "Pratik Gala",
    slug: "pratik-gala",
    lines: [
      "Meticulous, Software Engineer at heart, organized to the core",
      "Forced to manage accounts and HR",
    ],
  },
  {
    name: "Dipen Jain",
    slug: "dipen-jain",
    lines: ["Financer, finds value for money in everything", "King at heart"],
  },
  {
    name: "Riddhi Hublikar",
    slug: "riddhi-hublikar",
    photo: "riddhi-hublikar.jpg",
    lines: [
      "Keeps our project bible — logs every data / client / factory",
      "Fashion Designer, fabrics are her thing",
    ],
  },
  {
    name: "Yogitha Shetty",
    slug: "yogitha-shetty",
    photo: "yogitha-shetty.jpg",
    lines: [
      "Dentist — only actual doctor from our team",
      "Most soft spoken and kindest soul",
    ],
  },
  {
    name: "Pooja Kapadia",
    slug: "pooja-kapadia",
    photo: "pooja-kapadia.jpg",
    lines: ["DoodleDabble, Photographer… Artist", "Manages Mr. GB"],
  },
  {
    name: "Trisha Bhardwaj",
    slug: "trisha-bhardwaj",
    photo: "trisha-bhardwaj.jpg",
    lines: [
      "Ramu Kaka of our company — handles design, sales, marketing, branding, coffee, jhaadu, pocha, electrician… everything but nothing",
      "Minion to Vishal K",
    ],
  },
  {
    name: "Fatema Doctor",
    slug: "fatema-doctor",
    lines: [
      "Product Designer, Interior Designer, artist",
      "loooveesss flowery designs",
    ],
  },
  {
    name: "Joshua Joy",
    slug: "joshua-joy",
    photo: "joshua-joy.jpg",
    lines: [
      "Our 3D man… Industrial designer",
      "Super enthu for anything and everything",
      "Schrodinger's Cat",
      "loooves cast glass",
      "Joy",
    ],
  },
  {
    name: "Carmel Sebastian",
    slug: "carmel-sebastian",
    photo: "carmel-sebastian.jpg",
    lines: [
      "Our concept woman… an accidental discovery",
      "Artist… Shy… GenZ… surprisingly organized",
    ],
  },
  {
    name: "Vishal K",
    slug: "vishal-k",
    photo: "vishal-k.jpg",
    lines: [
      "Our own Buckingham Palace, the ex corporate slave",
      "Master Shifu trying to find his chi… also young only at heart",
    ],
  },
  {
    name: "Ajit Sir",
    slug: "ajit-sir",
    photo: "ajit-sir.jpg",
    lines: [
      "Brilliant mind",
      "Works on every software known for 3D designing — SketchUp, Rhino…",
    ],
  },
  {
    name: "Roshan Gaikwad",
    slug: "roshan-gaikwad",
    photo: "roshan-gaikwad.jpg",
    lines: [
      "Our man Friday for Architectural and Decorative lighting",
      "Part of the GenZ… but focused",
      "Cricketer",
      "Sarcastic",
    ],
  },
  {
    name: "Mahendra Shinde",
    slug: "mahendra-shinde",
    photo: "mahendra-shinde.jpg",
    lines: ["Technical help… site experience… jugaadu"],
  },
  {
    name: "Amar Bhai",
    slug: "amar-bhai",
    lines: ["Accidental find", "Super handy electrical help"],
  },
  {
    name: "Vishal Gujjar",
    slug: "vishal-gujjar",
    lines: ["Required Brawn"],
  },
  {
    name: "Sankesh Bhai",
    slug: "sankesh-bhai",
    photo: "sankesh-bhai.jpg",
    lines: ["Multi-tasker… support system for DSA", "Our stocks man (literally)"],
  },
  {
    name: "Dinesh Bhai",
    slug: "dinesh-bhai",
    photo: "dinesh-bhai.jpg",
    lines: ["Most organized out of all", "System and process oriented"],
  },
  {
    name: "Sandeep Bhai",
    slug: "sandeep-bhai",
    photo: "sandeep-bhai.jpg",
    lines: ["Apna hanuman — man Friday for any outside work"],
  },
  {
    name: "Faizal Bhai",
    slug: "faizal-bhai",
    photo: "faizal-bhai.jpg",
    lines: [
      "Man Friday for the workshop",
      "Anything 'banjayega' started with him",
    ],
  },
  {
    name: "Anji Bhai",
    slug: "anji-bhai",
    lines: [
      "Feather to our production cap",
      "Resourceful, jugaadu — only organized person at the workshop",
    ],
  },
  {
    name: "Sourav Kumar",
    slug: "sourav-kumar",
    photo: "sourav-kumar.jpg",
    lines: [
      "Our very own Ishaan Awasthi",
      "Will work as per his own moods and fancies",
      "Creator",
      "Sab banjayega",
    ],
  },
  {
    name: "Rakesh Bhai",
    slug: "rakesh-bhai",
    lines: ["Master of machines", "Master of Installations"],
  },
  {
    name: "Anil Bhai",
    slug: "anil-bhai",
    lines: ["Chota pataka, bada dhamaaka", "Small Magneto"],
  },
  {
    name: "Pappu Bhai",
    slug: "pappu-bhai",
    lines: ["He can bend and join metal as per his will", "Our own Magneto"],
  },
  {
    name: "Sushil",
    slug: "sushil",
    lines: ["Full on site support", "Texture king"],
  },
  {
    name: "Jeetu Bhai",
    slug: "jeetu-bhai",
    lines: ["Part of the crew"],
  },
  {
    name: "Aryan",
    slug: "aryan",
    photo: "aryan.jpg",
    lines: ["Engineer", "Fun", "Innovator"],
  },
  {
    name: "Amaan",
    slug: "amaan",
    photo: "amaan.jpg",
    lines: ["Engineer", "Very serious", "Innovator"],
  },
  // —— Had photos in the folder but weren't in the deck. Bios are placeholders
  //    until the studio sends the real lines.
  {
    name: "Arti Bhardwaj",
    slug: "arti-bhardwaj",
    photo: "arti-bhardwaj.jpg",
    lines: ["Part of the Blink Box family"],
  },
  {
    name: "Kush Sagar Bhardwaj",
    slug: "kush-sagar-bhardwaj",
    photo: "kush-sagar-bhardwaj.jpg",
    lines: ["Part of the Blink Box family"],
  },
  {
    name: "Ganesh Ghule",
    slug: "ganesh-ghule",
    photo: "ganesh-ghule.jpg",
    lines: ["Part of the crew"],
  },
];

// the four logo colors — used to tint the fallback avatar per person
const SWATCHES = [
  ["#ed7959", "#d94350"],
  ["#d94350", "#8b5fbf"],
  ["#8b5fbf", "#2a4cab"],
  ["#2a4cab", "#ed7959"],
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function PersonCard({ person, index }: { person: Person; index: number }) {
  const [imgOk, setImgOk] = useState(true);
  const [from, to] = SWATCHES[index % SWATCHES.length];
  const [role, ...quips] = person.lines;
  const showImg = imgOk && !!person.photo;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group"
      data-cursor="hover"
    >
      {/* Portrait */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-white/8 group-hover:border-[rgb(var(--lamp-glow))]/40 transition-colors duration-500">
        {showImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/team/${person.photo}`}
            alt={person.name}
            loading="lazy"
            onError={() => setImgOk(false)}
            className="absolute inset-0 w-full h-full object-cover object-center grayscale group-hover:grayscale-0 scale-[1.02] group-hover:scale-[1.06] transition-all duration-700 ease-out"
          />
        ) : (
          // graceful fallback — brand-tinted monogram until a PNG/JPG is added
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at 35% 30%, ${from}, ${to})`,
            }}
          >
            <span className="font-display text-5xl md:text-6xl text-white/90 tracking-wide">
              {initials(person.name)}
            </span>
            <span className="absolute inset-0 bg-black/15 group-hover:bg-black/0 transition-colors duration-500" />
          </div>
        )}

        {/* bottom gradient + glow sweep on hover */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[var(--bg-deep)] via-[var(--bg-deep)]/40 to-transparent pointer-events-none" />
        <span
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"
          style={{
            background:
              "linear-gradient(110deg, transparent 35%, rgba(var(--lamp-glow),0.18) 50%, transparent 65%)",
          }}
        />
      </div>

      {/* Caption */}
      <figcaption className="pt-4">
        <h3 className="font-display text-xl md:text-2xl text-white/95 leading-tight group-hover:text-[var(--lamp-warm)] transition-colors duration-500">
          {person.name}
        </h3>
        <p className="mt-1.5 text-sm text-white/55 leading-relaxed">{role}</p>
        {quips.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
            {quips.map((q) => (
              <li
                key={q}
                className="text-[11px] italic text-white/35 before:content-['·'] before:mr-2 before:text-[rgb(var(--lamp-glow))]/60 first:before:content-none"
              >
                {q}
              </li>
            ))}
          </ul>
        )}
      </figcaption>
    </motion.figure>
  );
}

export default function Team() {
  return (
    <section id="team" className="relative py-28 md:py-40 px-5 md:px-6">
      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
              N°10
            </span>
            <span className="h-px w-12 bg-white/15" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Our People
            </span>
          </div>
          <h1 className="font-display font-extralight text-[clamp(2.6rem,7vw,6rem)] leading-[1] mb-8">
            <span className="block">The hands behind</span>
            <span className="block italic gradient-temp">the light.</span>
          </h1>
          <p className="text-white/55 max-w-xl leading-relaxed">
            A studio is only as good as the people who stay late with it. Doctors,
            dentists, engineers, fashion designers, jugaadus and one accidental
            Magneto — somehow it all adds up to light.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <span className="font-mono text-sm text-[rgb(var(--lamp-glow))]">
              {PEOPLE.length.toString().padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/35">
              People · one workshop
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12 md:gap-x-8 md:gap-y-16">
          {PEOPLE.map((p, i) => (
            <PersonCard key={p.slug} person={p} index={i} />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-24 md:mt-32 thin-line" />
        <p className="mt-8 text-center text-[11px] uppercase tracking-[0.3em] text-white/30">
          Bengaluru workshop · By appointment
        </p>
      </div>
    </section>
  );
}
