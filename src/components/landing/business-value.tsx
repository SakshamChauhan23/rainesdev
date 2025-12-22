import { Container } from '@/components/layout/container'
import { TrendingUp, DollarSign, Target, Users } from 'lucide-react'

export function BusinessValue() {
  const values = [
    {
      icon: TrendingUp,
      title: 'Deploy AI workflows in days, not months'
    },
    {
      icon: DollarSign,
      title: 'Reduce dependency on custom development'
    },
    {
      icon: Target,
      title: 'Learn from workflows already tested in real business environments'
    },
    {
      icon: Users,
      title: 'Scale automation without scaling headcount'
    }
  ]

  return (
    <section className="border-y border-gray-300 bg-white py-20">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-light tracking-tight text-black sm:text-4xl">
            How This Helps Businesses
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-light text-gray-700">
            This platform helps businesses achieve faster adoption of AI with immediate ROI
          </p>
        </div>

        <div className="space-y-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="group flex items-start gap-6 border-l-2 border-gray-300 pl-6 transition-all duration-300 hover:border-[#8DEC42] hover:pl-8"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 transition-all duration-300 group-hover:bg-[#8DEC42]/10 group-hover:scale-110">
                <value.icon className="h-5 w-5 text-gray-700 transition-all duration-300 group-hover:text-[#8DEC42]" />
              </div>
              <h3 className="pt-1.5 text-lg font-normal text-black transition-all duration-300 group-hover:text-[#8DEC42]">
                {value.title}
              </h3>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
