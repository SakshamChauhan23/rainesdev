import { Container } from '@/components/layout/container'
import { CheckCircle2 } from 'lucide-react'

export function Differentiation() {
  const differences = [
    'Complete workflows, not isolated prompts',
    'Clear setup guides that work in real systems',
    'Agents designed for business outcomes, not experimentation',
    'End-to-end solutions ready to deploy',
    'Pre-configured for common SMB tools',
    'Purchase once, unlock forever',
  ]

  return (
    <section className="border-y border-gray-300 bg-white py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-light tracking-tight text-black sm:text-4xl">
              What Makes This Different
            </h2>
            <p className="text-lg font-light text-gray-700">
              Unlike generic AI tools, this marketplace focuses on practical, business-first
              solutions
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {differences.map((difference, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-brand-orange" />
                <p className="font-light text-black">{difference}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
