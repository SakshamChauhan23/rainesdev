import { Container } from '@/components/layout/container'
import { AlertCircle, CheckCircle2, Zap } from 'lucide-react'

export function WhyExists() {
  return (
    <section className="bg-white py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Problem */}
          <div>
            <h2 className="mb-6 text-3xl font-light tracking-tight text-black sm:text-4xl">
              Why This Marketplace Exists
            </h2>
            <p className="mb-8 text-lg font-light text-gray-700">
              Many businesses want to use AI agents but face real challenges:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-gray-600" />
                <p className="font-light text-black">
                  Do not know where to start with AI implementation
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-gray-600" />
                <p className="font-light text-black">
                  Do not have in-house AI expertise or resources
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-gray-600" />
                <p className="font-light text-black">
                  Do not want expensive custom builds for every workflow
                </p>
              </div>
            </div>
          </div>

          {/* Right: Solution */}
          <div className="flex flex-col justify-center">
            <div className="rounded-lg border border-gray-300 bg-white p-8">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-orange/10">
                <Zap className="h-6 w-6 text-brand-orange" />
              </div>
              <h3 className="mb-4 text-2xl font-normal text-black">
                Businesses do not need more AI hype — they need working solutions.
              </h3>
              <p className="mb-6 font-light text-gray-700">
                This marketplace bridges the gap between AI capability and real-world execution.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-brand-orange" />
                  <p className="font-light text-black">
                    Proven AI agent workflows that actually work
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-brand-orange" />
                  <p className="font-light text-black">
                    Discoverable, reusable, and ready to deploy
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-brand-orange" />
                  <p className="font-light text-black">No need to start from scratch every time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
