import { Navbar } from "@/components/layout/navbar"
import { HeroSection } from "@/components/home/hero-section"
import { AboutSection } from "@/components/home/about-section"
import { EventsSection } from "@/components/home/events-section"
import { NewsSection } from "@/components/home/news-section"
import { TeamSection } from "@/components/home/team-section"
import { GallerySection } from "@/components/home/gallery-section"
import { CTASection } from "@/components/home/cta-section"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <EventsSection />
        <NewsSection />
        <TeamSection />
        <GallerySection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
