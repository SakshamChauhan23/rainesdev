import { Hero } from '@/components/landing/hero'
import { WhyExists } from '@/components/landing/why-exists'
import { BusinessValue } from '@/components/landing/business-value'
import { CategoryGrid } from '@/components/landing/category-grid'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Personas } from '@/components/landing/personas'
import { Differentiation } from '@/components/landing/differentiation'
import { RainesDevContext } from '@/components/landing/rainesdev-context'
import { Principles } from '@/components/landing/principles'

export default function Home() {
  return (
    <>
      <Hero />
      <WhyExists />
      <BusinessValue />
      <CategoryGrid />
      <HowItWorks />
      <Personas />
      <Differentiation />
      <RainesDevContext />
      <Principles />
    </>
  )
}
