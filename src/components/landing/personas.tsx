import { Container } from '@/components/layout/container'
import { Building2, Code2, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Personas() {
  const personas = [
    {
      icon: Building2,
      title: 'Business Teams',
      description: 'Looking to deploy AI without custom builds',
      cta: 'Browse Agents',
      href: '/agents'
    },
    {
      icon: Code2,
      title: 'Indie Developers & AI Builders',
      description: 'Want to monetize real AI workflows',
      cta: 'Submit Agent',
      href: '/submit-agent'
    },
    {
      icon: Briefcase,
      title: 'Agencies & Consultants',
      description: 'Delivering AI solutions faster for clients',
      cta: 'Explore Solutions',
      href: '/agents'
    }
  ]

  return (
    <section className="bg-white py-20">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-light tracking-tight text-black sm:text-4xl">
            Who This Platform Is For
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-light text-gray-700">
            Whether you are deploying AI or building it, this marketplace connects you with proven workflows
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {personas.map((persona, index) => (
            <div
              key={index}
              className="flex flex-col rounded-lg border border-gray-300 bg-white p-8 transition-all hover:border-[#8DEC42]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white">
                <persona.icon className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="mb-2 text-xl font-normal text-black">
                {persona.title}
              </h3>
              <p className="mb-6 flex-1 font-light text-gray-700">
                {persona.description}
              </p>
              <Link href={persona.href}>
                <Button variant="outline" className="w-full border-gray-300 font-normal text-black hover:border-[#8DEC42] hover:bg-[#8DEC42] hover:text-white">
                  {persona.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
