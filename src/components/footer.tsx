"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { CompassLogo } from "@/components/compass-icon"

export function Footer() {
  return (
    <footer className="py-12 px-6 bg-secondary/50 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-3">
            <CompassLogo />
            <div className="flex flex-col">
              <span className="font-serif text-xl font-semibold text-foreground leading-tight">BENEFIT</span>
              <span className="text-xs text-muted-foreground leading-tight">Compass</span>
            </div>
          </div>

          <p className="text-muted-foreground text-sm text-center">
            Copyright {new Date().getFullYear()}. The BENEFIT Leadership Ethics Framework. <a href="https://allianceofleadershipfellows.org" target="_blank" rel="noopener noreferrer">Alliance of Leadership Fellows</a>. All rights reserved.
          </p>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>for ethical leaders</span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
