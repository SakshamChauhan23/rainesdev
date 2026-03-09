import { Hero } from '@/components/landing/hero'
import { DentalPromo } from '@/components/landing/dental-promo'
import { PlatformFeatures } from '@/components/landing/platform-features'
import { HowItWorksTimeline } from '@/components/landing/how-it-works-timeline'
import { AISavingsReviewCTA } from '@/components/landing/ai-savings-review-cta'
import { FAQSection } from '@/components/landing/faq-section'

export default function Home() {
  return (
    <div className="scroll-smooth">
      <Hero />
      <DentalPromo />
      <PlatformFeatures />
      <HowItWorksTimeline />
      <AISavingsReviewCTA />
      <FAQSection />
    </div>
  )
}
