"use client"

import { motion } from "framer-motion"

export function VideoSection() {
  return (
    <section className="py-20 px-6 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4 text-balance">
            Learn More About the BENEFIT Framework
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover how ethical leadership can transform organizations and communities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-border/50"
        >
          <iframe
            src="https://www.youtube.com/embed/m9YR0aBKfBc"
            title="BENEFIT Leadership Framework"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </motion.div>
      </div>
    </section>
  )
}
