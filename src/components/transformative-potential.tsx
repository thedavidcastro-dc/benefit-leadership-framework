"use client"

import { motion } from "framer-motion"
import { Handshake, Building2, Brain } from "lucide-react"

const impacts = [
  {
    icon: Handshake,
    title: "Rebuilding Trust",
    description: "Restore confidence in leadership through consistent ethical behavior and transparent communication that honors commitments.",
    stat: "Trust",
    color: "bg-accent/10 text-accent"
  },
  {
    icon: Building2,
    title: "Humanizing Workplaces",
    description: "Create environments where people are valued as whole human beings, fostering psychological safety and authentic connection.",
    stat: "Culture",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: Brain,
    title: "Strengthening Ethical Decision-Making",
    description: "Develop robust frameworks for navigating complex moral challenges with clarity, consistency, and courage.",
    stat: "Decisions",
    color: "bg-emerald-500/10 text-emerald-600"
  }
]

export function TransformativePotential() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-medium text-sm tracking-wider uppercase mb-4 block">
            The Impact
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Transformative Potential
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The BENEFIT framework creates lasting change across organizations and communities.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {impacts.map((impact, index) => {
            const Icon = impact.icon
            return (
              <motion.div
                key={impact.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative group"
              >
                <div className="glass rounded-2xl p-8 h-full transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/5 group-hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-xl ${impact.color} flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                    {impact.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {impact.description}
                  </p>

                  <div className="mt-6 pt-6 border-t border-border">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Focus Area</span>
                    <p className="text-lg font-semibold text-foreground mt-1">{impact.stat}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
