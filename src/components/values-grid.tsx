"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Heart, Users, Hand, Scale, Flower2, Shield, Eye } from "lucide-react"

const values = [
  {
    letter: "B",
    name: "Benevolence",
    definition: "The active disposition to seek the welfare of others",
    significance: "Leaders who embody benevolence prioritize the well-being of their teams and communities, creating environments where everyone can thrive.",
    icon: Heart,
    color: "text-rose-500"
  },
  {
    letter: "E",
    name: "Empathy",
    definition: "The capacity to understand and share the feelings of another",
    significance: "Empathetic leaders build deep connections, fostering trust and psychological safety within their organizations.",
    icon: Users,
    color: "text-blue-500"
  },
  {
    letter: "N",
    name: "Nonviolence",
    definition: "The practice of achieving goals through peaceful means",
    significance: "Leading through dialogue and shared inquiry, resolving conflicts constructively rather than through force or coercion.",
    icon: Hand,
    color: "text-green-500"
  },
  {
    letter: "E",
    name: "Equity",
    definition: "Fair treatment and opportunity for all people",
    significance: "Equitable leaders ensure fair distribution of resources and opportunities, addressing systemic barriers to success.",
    icon: Scale,
    color: "text-amber-500"
  },
  {
    letter: "F",
    name: "Flourishing",
    definition: "The state of growing and developing in a healthy way",
    significance: "Creating conditions where individuals and communities can achieve their fullest potential and live meaningful lives.",
    icon: Flower2,
    color: "text-emerald-500"
  },
  {
    letter: "I",
    name: "Integrity",
    definition: "The quality of being honest and having strong moral principles",
    significance: "Leaders with integrity align their actions with their values, building credibility and inspiring others through consistency.",
    icon: Shield,
    color: "text-indigo-500"
  },
  {
    letter: "T",
    name: "Transparency",
    definition: "Operating in such a way that it is easy for others to see what actions are performed",
    significance: "Transparent leaders share information openly, fostering accountability and enabling informed decision-making.",
    icon: Eye,
    color: "text-cyan-500"
  }
]

function ValueCard({ value, index }: { value: typeof values[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = value.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group cursor-pointer"
    >
      <div className="glass rounded-2xl p-6 h-full transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/5 group-hover:-translate-y-1">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center ${value.color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-4xl font-serif font-bold text-accent">{value.letter}</span>
          </div>
        </div>
        
        <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{value.name}</h3>
        
        <motion.div
          initial={false}
          animate={{ height: isHovered ? "auto" : "48px", opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="text-sm text-muted-foreground mb-3">
            <span className="font-medium text-foreground">Definition:</span> {value.definition}
          </p>
          
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2, delay: isHovered ? 0.1 : 0 }}
          >
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Leadership Significance:</span> {value.significance}
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-4 right-4 text-xs text-muted-foreground"
          initial={false}
          animate={{ opacity: isHovered ? 0 : 1 }}
        >
          Hover to learn more
        </motion.div>
      </div>
    </motion.div>
  )
}

export function ValuesGrid() {
  return (
    <section className="py-24 px-6 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-medium text-sm tracking-wider uppercase mb-4 block">
            The Seven Values
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            The BENEFIT Values
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Each value represents a pillar of ethical leadership, working together to create transformational change.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <ValueCard key={value.name} value={value} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
