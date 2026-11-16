"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import { CompassIcon } from "@/components/compass-icon"

const panels = [
  { id: "gqzWk5ngnxs", date: "April 23, 2026", theme: "Benevolence, Equity & Nonviolence" },
  { id: "gbggW5lLLgU", date: "June 11, 2026", theme: "Equity & Flourishing" },
  { id: "tF9CN3VO_f4", date: "July 9, 2026", theme: "Integrity & Transparency" },
  { id: "qtelmoN9MQY", date: "November 5, 2026", theme: "Meet the Authors: Ethical Leadership for a Fraying World" },
]

export function HeroSection() {
  const [active, setActive] = useState(0)
  const go = (dir: number) => setActive((i) => (i + dir + panels.length) % panels.length)
  const panel = panels[active]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-background to-background" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      {/* Large animated compass in background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <CompassIcon size={400} className="text-accent/5" animate />
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent-foreground border border-accent/20 text-sm font-medium">
            <CompassIcon size={18} className="text-accent" />
            The BENEFIT Compass
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-8 text-balance"
        >
          Your Compass for Ethical and Transformational Leadership
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed text-pretty"
        >
          Navigate leadership with seven guiding values: <span className="text-foreground font-medium">Benevolence</span>, <span className="text-foreground font-medium">Empathy</span>, <span className="text-foreground font-medium">Nonviolence</span>, <span className="text-foreground font-medium">Equity</span>, <span className="text-foreground font-medium">Flourishing</span>, <span className="text-foreground font-medium">Integrity</span>, and <span className="text-foreground font-medium">Transparency</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-medium"
            onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Join the Community
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-6 text-base font-medium border-border hover:bg-secondary"
            onClick={() => document.getElementById('values')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore the Values
          </Button>
        </motion.div>

        {/* Featured: Social Innovations Journal special issue */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <a
            href="https://socialinnovationsjournal.com/index.php/sij"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 text-left rounded-2xl border border-accent/30 bg-accent/5 hover:bg-accent/10 transition-colors p-5 sm:p-6 shadow-sm"
          >
            <div className="shrink-0 w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-accent-foreground/70">Featured Publication</p>
              <h3 className="font-serif text-lg md:text-xl text-foreground mt-0.5 text-balance">The BENEFIT Ethical Framework — Special Issue</h3>
              <p className="text-sm text-muted-foreground mt-1">A special issue of the Social Innovations Journal exploring the framework in depth.</p>
            </div>
            <span className="shrink-0 hidden sm:inline-flex items-center gap-1 text-sm font-medium text-accent-foreground group-hover:translate-x-0.5 transition-transform">
              Read it <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </motion.div>

        {/* Panel discussion video carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-14 max-w-3xl mx-auto"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">Watch our panel discussions</p>

          <div className="relative">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border bg-black">
              <iframe
                key={panel.id}
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${panel.id}?rel=0`}
                title={`${panel.date} Panel Discussion — ${panel.theme}`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous panel"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background/90 backdrop-blur border border-border shadow-lg flex items-center justify-center text-foreground hover:text-emerald-700 hover:bg-background transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next panel"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background/90 backdrop-blur border border-border shadow-lg flex items-center justify-center text-foreground hover:text-emerald-700 hover:bg-background transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-5">
            <p className="font-serif text-xl md:text-2xl text-foreground">{panel.theme}</p>
            <p className="text-sm text-muted-foreground mt-1">{panel.date} Panel Discussion</p>
          </div>

          <div className="flex justify-center items-center gap-2.5 mt-5">
            {panels.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${p.theme} panel`}
                aria-current={i === active}
                className={`h-2.5 rounded-full transition-all ${i === active ? "w-8 bg-emerald-600" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
          >
            <motion.div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full mt-2" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
