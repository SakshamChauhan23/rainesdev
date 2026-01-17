import { Container } from '@/components/layout/container'
import { Target, FileText, Users } from 'lucide-react'

export function Principles() {
  const principles = [
    {
      icon: Target,
      number: '1',
      title: 'Solves a real business problem',
      description: 'Every agent addresses actual challenges faced by businesses'
    },
    {
      icon: FileText,
      number: '2',
      title: 'Comes with clear setup documentation',
      description: 'Comprehensive guides ensure smooth implementation'
    },
    {
      icon: Users,
      number: '3',
      title: 'Designed to be usable by non-experts',
      description: 'No AI expertise required to deploy and use'
    }
  ]

  return (
    <section className="bg-white py-20">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-light tracking-tight text-black sm:text-4xl">
            Marketplace Principles
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-light text-gray-700">
            Every agent on this platform follows three core principles
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {principles.map((principle, index) => (
            <div key={index} className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#8DEC42] to-[#7ACC3B]">
                  <principle.icon className="h-8 w-8 text-white" />
                  <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#404145] text-xs font-semibold text-white">
                    {principle.number}
                  </div>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-normal text-black">
                {principle.title}
              </h3>
              <p className="font-light text-gray-700">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
