"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  FileText,
  Layers,
  Sparkles,
  Upload,
} from "lucide-react";
import { useReducedMotionPreference } from "@/hooks/useReducedMotion";
import { fadeUp, staggerContainer } from "@/lib/motion-variants";

const steps = [
  {
    number: "01",
    title: "Upload",
    description: "Drop your PDF, DOCX, PNG, JPG, or text file in seconds.",
  },
  {
    number: "02",
    title: "Generate",
    description:
      "Choose summary, flashcards, or key points and let AI process your content.",
  },
  {
    number: "03",
    title: "Review",
    description:
      "Edit names, open original files, and revisit all generations from dashboard.",
  },
  {
    number: "04",
    title: "Retain",
    description:
      "Use the generated output as study-ready notes and repeatable references.",
  },
];

const testimonials = [
  {
    quote:
      "I process research papers in minutes now. The editorial layout actually makes me want to read generated results.",
    author: "Sarah C.",
    role: "Graduate Student",
  },
  {
    quote:
      "The flashcards output is cleaner than any generic AI tool I tried before.",
    author: "Marcus R.",
    role: "Business Analyst",
  },
  {
    quote:
      "Clear hierarchy, easy scanning, and the dashboard is perfect for long-term use.",
    author: "Dr. Watson",
    role: "Researcher",
  },
];

export default function HomePage() {
  const reducedMotion = useReducedMotionPreference();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((event.clientX - centerX) / rect.width) * 8;
    const rotateX = -((event.clientY - centerY) / rect.height) * 5;

    cardRef.current.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transition = "transform 0.5s ease-out";
    cardRef.current.style.transform =
      "perspective(1200px) rotateX(0deg) rotateY(0deg)";
  };

  const sectionAnimation = reducedMotion ? {} : { initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.2 }, variants: staggerContainer };

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#0F0E0C]">
      <header className="sticky top-0 z-50 border-b border-[#E8E1D6] bg-[#FAF8F4]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[1100px] items-center justify-between px-4">
          <Link href="/" className="text-xl">
            <span className="font-serif italic">Note</span>
            <span className="font-serif text-[#E8952F]">Whiz</span>
          </Link>

          <div className="hidden items-center gap-6 text-sm text-[#7A756A] md:flex">
            <Link href="/features" className="hover:text-[#3A3832]">Features</Link>
            <Link href="/pricing" className="hover:text-[#3A3832]">Pricing</Link>
            <Link href="/demo" className="hover:text-[#3A3832]">Demo</Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/auth/signin"
              className="rounded-lg border border-[#E8E1D6] bg-white px-4 py-2 text-sm text-[#3A3832] transition hover:border-[#B5B0A5]"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-[#0F0E0C] px-4 py-2 text-sm text-[#FAF8F4] transition hover:bg-[#3A3832]"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-10 px-4 pb-14 pt-16 lg:grid-cols-[1.08fr_1fr]">
          <motion.div
            initial={reducedMotion ? false : "hidden"}
            animate={reducedMotion ? {} : "visible"}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.p
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-[#E8E1D6] bg-white px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[#C97C2A]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Warm Editorial Utility
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="font-serif text-5xl leading-[1.04] text-[#0F0E0C] md:text-6xl"
            >
              Transform documents into
              <span className="block text-[#C97C2A] italic">actionable notes</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="max-w-xl text-lg leading-relaxed text-[#7A756A]">
              NoteWhiz converts long files into summaries, flashcards, and key points with a tactile reading experience designed for focus.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0F0E0C] px-5 py-3 text-sm text-[#FAF8F4] transition hover:bg-[#3A3832]"
              >
                Start free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-lg border border-[#E8E1D6] bg-white px-5 py-3 text-sm text-[#3A3832] transition hover:border-[#B5B0A5]"
              >
                View demo
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-6 text-sm text-[#7A756A]">
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#C97C2A]" /> No credit card</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#C97C2A]" /> Secure uploads</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#C97C2A]" /> Fast generation</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={reducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
            className="self-center"
          >
            <div
              ref={cardRef}
              className={`demo-card-wrap ${reducedMotion ? "" : "idle"} overflow-hidden rounded-xl border border-[#E8E1D6] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_24px_rgba(0,0,0,0.04)]`}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center gap-2 border-b border-[#E8E1D6] bg-[#F2EDE6] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#B5B0A5]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#B5B0A5]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#B5B0A5]" />
                <span className="ml-2 font-mono text-xs text-[#7A756A]">notewhiz.app/upload</span>
              </div>

              <div className="grid gap-0 md:grid-cols-2">
                <div className="border-b border-[#E8E1D6] p-5 md:border-b-0 md:border-r">
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[#C97C2A]">Source</p>
                  <div className="rounded-lg border border-dashed border-[#E8E1D6] bg-[#FAF8F4] p-5 text-[#7A756A]">
                    <Upload className="mb-3 h-5 w-5 text-[#C97C2A]" />
                    Drag your PDF here
                  </div>
                </div>
                <div className="p-5">
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[#C97C2A]">Generated</p>
                  <div className="space-y-3 rounded-lg border border-[#E8E1D6] bg-[#FFFFFF] p-4">
                    <p className="text-sm text-[#3A3832]">Top 5 insights extracted and reformatted for quick revision.</p>
                    <div className="h-2 w-full rounded-full bg-[#F2EDE6]" />
                    <div className="h-2 w-4/5 rounded-full bg-[#F2EDE6]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="border-y border-[#E8E1D6] bg-[#F2EDE6]">
          <div className="mx-auto flex w-full max-w-[1100px] flex-wrap items-center justify-between gap-4 px-4 py-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#7A756A]">Trusted by learners and teams</p>
            <div className="flex flex-wrap items-center gap-6 text-sm text-[#B5B0A5]">
              <span>StudyLabs</span>
              <span>Northfield</span>
              <span>EdgeBridge</span>
              <span>Aster Group</span>
            </div>
          </div>
        </section>

        <motion.section {...sectionAnimation} className="mx-auto w-full max-w-[1100px] px-4 py-16">
          <div className="mb-10 flex items-end justify-between gap-4">
            <h2 className="text-4xl">Built for focused workflows</h2>
            <p className="max-w-md text-sm leading-relaxed text-[#7A756A]">
              Editorial warmth + production-grade utility. You get hierarchy, readability, and speed in one interface.
            </p>
          </div>

          <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-[#E8E1D6] bg-white md:grid-cols-3">
            <motion.article variants={fadeUp} className="border-b border-[#E8E1D6] p-8 md:border-b-0 md:border-r">
              <p className="font-mono text-xs text-[#C97C2A]">01</p>
              <FileText className="my-4 h-6 w-6 text-[#C97C2A]" />
              <h3 className="mb-2 font-sans text-xl font-semibold">Precise summaries</h3>
              <p className="text-sm leading-relaxed text-[#7A756A]">Long text is condensed into clean, skimmable notes with no visual clutter.</p>
            </motion.article>
            <motion.article variants={fadeUp} className="border-b border-[#E8E1D6] p-8 md:border-b-0 md:border-r">
              <p className="font-mono text-xs text-[#C97C2A]">02</p>
              <Layers className="my-4 h-6 w-6 text-[#C97C2A]" />
              <h3 className="mb-2 font-sans text-xl font-semibold">Type-aware output</h3>
              <p className="text-sm leading-relaxed text-[#7A756A]">Switch among summaries, flashcards, and key points with dedicated visual tags.</p>
            </motion.article>
            <motion.article variants={fadeUp} className="p-8">
              <p className="font-mono text-xs text-[#C97C2A]">03</p>
              <Sparkles className="my-4 h-6 w-6 text-[#C97C2A]" />
              <h3 className="mb-2 font-sans text-xl font-semibold">Intentional motion</h3>
              <p className="text-sm leading-relaxed text-[#7A756A]">Animations communicate state changes and progress without distracting from content.</p>
            </motion.article>
          </div>
        </motion.section>

        <section className="bg-[#0F0E0C] py-16 text-[#FAF8F4]">
          <div className="mx-auto w-full max-w-[1100px] px-4">
            <h2 className="text-4xl text-[#FAF8F4]">How it works</h2>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <div key={step.number} className="relative rounded-xl border border-white/10 bg-white/5 p-5">
                  <p className="mb-4 font-mono text-xs text-[#E8952F]">{step.number}</p>
                  <h3 className="mb-2 font-sans text-lg font-semibold text-[#FAF8F4]">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-white/65">{step.description}</p>
                  <span className="pointer-events-none absolute right-3 top-2 font-serif text-5xl text-white/5">{step.number}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <motion.section {...sectionAnimation} className="mx-auto w-full max-w-[1100px] px-4 py-16">
          <h2 className="mb-8 text-4xl">What users say</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <motion.article
                key={item.author}
                variants={fadeUp}
                className="rounded-xl border border-[#E8E1D6] bg-[#F2EDE6] p-6"
              >
                <p className="font-serif text-xl italic text-[#3A3832]">"{item.quote}"</p>
                <p className="mt-5 font-medium text-[#0F0E0C]">{item.author}</p>
                <p className="text-sm text-[#7A756A]">{item.role}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <section className="bg-[#F2EDE6] py-16">
          <div className="mx-auto w-full max-w-[820px] px-4 text-center">
            <h2 className="text-4xl">Ready to simplify your study workflow?</h2>
            <p className="mx-auto mt-4 max-w-xl text-[#7A756A]">Start with one upload and experience the exact workflow: clean extraction, controlled generation, and durable results.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/auth/signup" className="rounded-lg bg-[#0F0E0C] px-5 py-3 text-sm text-[#FAF8F4] transition hover:bg-[#3A3832]">Get started</Link>
              <Link href="/auth/signin" className="rounded-lg border border-[#E8E1D6] bg-white px-5 py-3 text-sm text-[#3A3832] transition hover:border-[#B5B0A5]">Sign in</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E8E1D6] bg-[#FAF8F4]">
        <div className="mx-auto grid w-full max-w-[1100px] grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4">
          <div>
            <p className="text-lg"><span className="font-serif italic">Note</span><span className="font-serif text-[#E8952F]">Whiz</span></p>
            <p className="mt-3 text-sm text-[#7A756A]">Document intelligence with an intentional interface.</p>
          </div>
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[#B5B0A5]">Product</p>
            <div className="space-y-1.5 text-sm text-[#7A756A]">
              <Link href="/features" className="block hover:text-[#3A3832]">Features</Link>
              <Link href="/pricing" className="block hover:text-[#3A3832]">Pricing</Link>
              <Link href="/demo" className="block hover:text-[#3A3832]">Demo</Link>
            </div>
          </div>
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[#B5B0A5]">Support</p>
            <div className="space-y-1.5 text-sm text-[#7A756A]">
              <Link href="/help" className="block hover:text-[#3A3832]">Help</Link>
              <Link href="/contact" className="block hover:text-[#3A3832]">Contact</Link>
              <Link href="/status" className="block hover:text-[#3A3832]">Status</Link>
            </div>
          </div>
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[#B5B0A5]">Legal</p>
            <div className="space-y-1.5 text-sm text-[#7A756A]">
              <Link href="/privacy" className="block hover:text-[#3A3832]">Privacy</Link>
              <Link href="/terms" className="block hover:text-[#3A3832]">Terms</Link>
              <Link href="/cookies" className="block hover:text-[#3A3832]">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
