import { Hero } from '@/components/landing/hero'
import { PlatformFeatures } from '@/components/landing/platform-features'
import { HowItWorksTimeline } from '@/components/landing/how-it-works-timeline'
import { CategoryGrid } from '@/components/landing/category-grid'
import { FAQSection } from '@/components/landing/faq-section'

export default function Home() {
  return (
    <div className="scroll-smooth">
      <Hero />
      <PlatformFeatures />
      <HowItWorksTimeline />
      <CategoryGrid />
      <FAQSection />
    </div>
  )
}
