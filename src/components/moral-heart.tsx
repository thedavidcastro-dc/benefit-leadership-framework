"use client"

import { motion } from "framer-motion"
import { Heart, Users, Hand, ArrowRight } from "lucide-react"

const coreValues = [
  {
    name: "Benevolence",
    icon: Heart,
    description: "The foundation of caring leadership",
    color: "from-rose-500/20 to-rose-500/5"
  },
  {
    name: "Empathy",
    icon: Users,
    description: "Understanding others deeply",
    color: "from-blue-500/20 to-blue-500/5"
  },
  {
    name: "Nonviolence",
    icon: Hand,
    description: "Leading through dialogue",
    color: "from-green-500/20 to-green-500/5"
  }
]

export function MoralHeart() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background via-secondary/20 to-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent font-medium text-sm tracking-wider uppercase mb-4 block">
              The Integration
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              The Moral Heart
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              At the core of the BENEFIT framework lies the Moral Heart: the integration of Benevolence, Empathy, and Nonviolence. These three values form the ethical foundation upon which all other values build, creating a holistic approach to transformational leadership.
            </p>
            <div className="space-y-4">
              {[
                "Benevolence provides the motivation to act for others' good",
                "Empathy enables deep understanding of others' experiences",
                "Nonviolence ensures that actions honor human dignity"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <ArrowRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Central visualization */}
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-border/50 animate-[spin_60s_linear_infinite]" />
              
              {/* Middle ring with glow */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-accent/20 to-transparent" />
              
              {/* Inner circle - The Heart */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-16 rounded-full bg-gradient-to-br from-accent/30 via-accent/10 to-transparent flex items-center justify-center shadow-2xl shadow-accent/20"
              >
                <div className="text-center">
                  <Heart className="w-12 h-12 text-accent mx-auto mb-2" />
                  <span className="font-serif text-lg font-semibold text-foreground">Moral Heart</span>
                </div>
              </motion.div>

              {/* Orbiting values */}
              {coreValues.map((value, index) => {
                const angle = (index * 120 - 90) * (Math.PI / 180)
                const radius = 42 // percentage from center
                const x = 50 + radius * Math.cos(angle)
                const y = 50 + radius * Math.sin(angle)
                const Icon = value.icon

                return (
                  <motion.div
                    key={value.name}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                    className="absolute w-24 h-24 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${value.color} glass flex flex-col items-center justify-center p-2 text-center`}>
                      <Icon className="w-6 h-6 text-foreground mb-1" />
                      <span className="text-xs font-medium text-foreground">{value.name}</span>
                    </div>
                  </motion.div>
                )
              })}

              {/* Connecting lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                {coreValues.map((_, index) => {
                  const angle = (index * 120 - 90) * (Math.PI / 180)
                  const radius = 42
                  const x = 50 + radius * Math.cos(angle)
                  const y = 50 + radius * Math.sin(angle)
                  return (
                    <motion.line
                      key={index}
                      x1="50"
                      y1="50"
                      x2={x}
                      y2={y}
                      stroke="url(#lineGradient)"
                      strokeWidth="0.5"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                  )
                })}
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
