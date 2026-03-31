"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const leaders = [
  {
    name: "Nelson Mandela",
    title: "Champion of Reconciliation",
    highlight: "Reconciliation",
    image: "/leaders/mandela.jpg",
    quote: "Education is the most powerful weapon which you can use to change the world.",
    bio: "Nelson Mandela exemplified the BENEFIT values through his lifelong commitment to justice, reconciliation, and human dignity. After 27 years of imprisonment, he emerged not with bitterness but with a vision of a united South Africa. His leadership demonstrated how benevolence and empathy can transform even the deepest wounds into pathways for healing and progress.",
    values: ["Benevolence", "Empathy", "Nonviolence"]
  },
  {
    name: "Harriet Tubman",
    title: "Conductor of Freedom",
    highlight: "Courageous Liberation",
    image: "/leaders/tubman.jpg",
    quote: "Every great dream begins with a dreamer. Always remember, you have within you the strength, the patience, and the passion to reach for the stars to change the world.",
    bio: "Harriet Tubman embodied courage and integrity as a conductor on the Underground Railroad, risking her life repeatedly to guide over 70 enslaved people to freedom. Her unwavering commitment to liberation and her strategic brilliance made her a legendary figure in the fight against oppression. She demonstrated that true leadership often requires personal sacrifice for the flourishing of others.",
    values: ["Integrity", "Flourishing", "Equity"]
  },
  {
    name: "Martin Luther King Jr.",
    title: "Architect of the Beloved Community",
    highlight: "The Beloved Community",
    image: "/leaders/king.jpg",
    quote: "Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.",
    bio: "Dr. Martin Luther King Jr. articulated a vision of the Beloved Communityâa society based on justice, equal opportunity, and love of one's fellow human beings. His commitment to nonviolent resistance and his ability to inspire millions through transparent moral leadership transformed the civil rights movement and continues to influence leaders worldwide.",
    values: ["Nonviolence", "Transparency", "Empathy"]
  }
]

function LeaderCard({ leader, index }: { leader: typeof leaders[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="flex-shrink-0 w-[350px] md:w-[400px]"
    >
      <Dialog>
        <DialogTrigger asChild>
          <div className="glass rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
            <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/5 transition-colors" />
              <span className="font-serif text-6xl font-bold text-primary/30">{leader.name.charAt(0)}</span>
            </div>
            <div className="p-6">
              <span className="text-accent text-sm font-medium">{leader.highlight}</span>
              <h3 className="font-serif text-2xl font-semibold text-foreground mt-1 mb-2">{leader.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{leader.title}</p>
              <div className="flex flex-wrap gap-2">
                {leader.values.map((value) => (
                  <span key={value} className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground">
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{leader.name}</DialogTitle>
            <DialogDescription className="text-accent font-medium">{leader.title}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex items-start gap-3 mb-6 p-4 bg-secondary/50 rounded-xl">
              <Quote className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <p className="italic text-foreground">{leader.quote}</p>
            </div>
            <p className="text-muted-foreground leading-relaxed">{leader.bio}</p>
            <div className="flex flex-wrap gap-2 mt-6">
              {leader.values.map((value) => (
                <span key={value} className="px-3 py-1.5 bg-accent/10 text-accent-foreground rounded-full text-sm font-medium">
                  {value}
                </span>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export function LeadersCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -420 : 420
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6"
        >
          <div>
            <span className="text-accent font-medium text-sm tracking-wider uppercase mb-4 block">
              Embodied Examples
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
              Leaders of the Framework
            </h2>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="rounded-full w-12 h-12 border-border hover:bg-secondary"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="rounded-full w-12 h-12 border-border hover:bg-secondary"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-6 pb-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="flex-shrink-0 w-[calc((100vw-1280px)/2+1.5rem)] md:block hidden" />
        {leaders.map((leader, index) => (
          <div key={leader.name} style={{ scrollSnapAlign: "start" }}>
            <LeaderCard leader={leader} index={index} />
          </div>
        ))}
        <div className="flex-shrink-0 w-6" />
      </div>
    </section>
  )
}
