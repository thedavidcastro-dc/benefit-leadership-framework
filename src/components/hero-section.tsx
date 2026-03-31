"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { CompassIcon } from "@/components/compass-icon"

export function HeroSection() {
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
