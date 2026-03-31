import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ValuesGrid } from "@/components/values-grid"
import { VideoSection } from "@/components/video-section"
import { LeadersCarousel } from "@/components/leaders-carousel"
import { MoralHeart } from "@/components/moral-heart"
import { TransformativePotential } from "@/components/transformative-potential"
import { CommunitySignup } from "@/components/community-signup"
import { Footer } from "@/components/footer"

export default function BenefitFrameworkPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      <HeroSection />
      
      <section id="values">
        <ValuesGrid />
      </section>

      <VideoSection />
      
      <section id="leaders">
        <LeadersCarousel />
      </section>
      
      <section id="moral-heart">
        <MoralHeart />
      </section>
      
      <section id="impact">
        <TransformativePotential />
      </section>
      
      <CommunitySignup />
      
      <Footer />
    </main>
  )
}
