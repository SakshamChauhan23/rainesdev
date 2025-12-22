import { Container } from '@/components/layout/container'
import { Wrench, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function RainesDevContext() {
  return (
    <section className="bg-[#404145] py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
              <Wrench className="h-8 w-8 text-orange-300" />
            </div>
          </div>

          <h2 className="mb-6 text-3xl font-light tracking-tight text-white sm:text-4xl">
            Built by{' '}
            <a
              href="https://www.rainesdev.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-normal text-[#8DEC42] hover:text-[#7ACC3B] transition-colors underline decoration-[#8DEC42]/30 hover:decoration-[#7ACC3B]"
            >
              RainesDev.ai
            </a>
          </h2>

          <p className="mb-8 text-lg font-light text-white/90">
            This marketplace is built and operated by{' '}
            <a
              href="https://www.rainesdev.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-normal text-[#8DEC42] hover:text-[#7ACC3B] transition-colors"
            >
              RainesDev.ai
            </a>
            , a team that works hands-on with AI systems in real business environments.
          </p>

          <p className="mb-10 text-base font-light text-white/80">
            Instead of keeping effective workflows locked inside internal and client projects, we are making them reusable so teams can deploy what actually works faster, with less guesswork.
          </p>
        </div>
      </Container>
    </section>
  )
}
