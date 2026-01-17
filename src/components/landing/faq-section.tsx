'use client'

import { Container } from '@/components/layout/container'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export function FAQSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const faqs = [
    {
      question: 'What is an AI agent?',
      answer:
        'An AI agent is a software program that uses artificial intelligence to perform tasks autonomously. Our marketplace features AI agents that can handle everything from customer service and sales outreach to data analysis and content creation.',
    },
    {
      question: 'How do I get started as a buyer?',
      answer:
        "Simply browse our marketplace, select an AI agent that fits your needs, and complete the checkout process. You'll receive instant access to your agent with a setup link. No coding or technical expertise required!",
    },
    {
      question: 'Can I try an agent before purchasing?',
      answer:
        "Many sellers offer demo versions or trial periods for their agents. Check the agent's detail page for demo links and trial information. You can also read verified buyer reviews to make an informed decision.",
    },
    {
      question: 'How do I become a seller?',
      answer:
        'Sign up for a seller account, create your AI agent listing with detailed descriptions and features, set your pricing, and submit for review. Once approved, your agent will be live on the marketplace for buyers to discover.',
    },
    {
      question: 'What fees do sellers pay?',
      answer:
        'We charge a small commission on each sale to maintain the platform, provide customer support, and market your agents. There are no upfront listing fees. You only pay when you make a sale.',
    },
    {
      question: 'How do I integrate an AI agent with my tools?',
      answer:
        'Each AI agent comes with detailed integration guides and setup instructions. Most agents offer simple API connections or webhook integrations that work with popular tools like Gmail, Slack, Shopify, and more.',
    },
    {
      question: 'What if I need help or support?',
      answer:
        'We offer comprehensive support for both buyers and sellers. Contact the seller directly for agent-specific questions, or reach out to our support team for platform-related assistance. We also have extensive documentation and tutorials.',
    },
    {
      question: 'Are the AI agents secure and reliable?',
      answer:
        'All agents go through a rigorous review process before being listed. We verify functionality, security standards, and compliance with our marketplace guidelines. Verified buyers can also leave reviews to help others assess reliability.',
    },
  ]

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-20 sm:py-28 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-10 top-1/3 h-96 w-96 rounded-full bg-brand-orange/5 blur-3xl" />
        <div className="absolute bottom-1/3 left-10 h-96 w-96 rounded-full bg-brand-orange/5 blur-3xl" />
      </div>

      <Container>
        <div className="mx-auto max-w-4xl">
          {/* Section Header */}
          <div
            className={`mb-16 text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <div className="mb-6 inline-flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-orange/10">
                <HelpCircle className="h-8 w-8 text-brand-orange" />
              </div>
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-brand-slate sm:text-4xl md:text-5xl">
              Frequently Asked{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-brand-orange">Questions</span>
                <span className="absolute bottom-2 left-0 right-0 -z-0 h-3 bg-brand-orange/20" />
              </span>
            </h2>
            <p className="text-lg text-brand-slate/70 sm:text-xl">
              Everything you need to know about our platform
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4" role="region" aria-label="Frequently Asked Questions">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index
              const headingId = `faq-heading-${index}`
              const panelId = `faq-panel-${index}`

              return (
                <div
                  key={index}
                  className={`group rounded-2xl border-2 bg-brand-cream/30 backdrop-blur-sm transition-all duration-500 ${
                    isOpen
                      ? 'border-brand-orange shadow-lg shadow-brand-orange/10'
                      : 'border-brand-slate/10 hover:border-brand-orange/30 hover:bg-white'
                  } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  <h3>
                    <button
                      id={headingId}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-4 p-6 text-left transition-all"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                    >
                      <span
                        className={`text-lg font-semibold transition-colors ${
                          isOpen
                            ? 'text-brand-orange'
                            : 'text-brand-slate group-hover:text-brand-orange'
                        }`}
                      >
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-6 w-6 flex-shrink-0 transition-all duration-300 ${
                          isOpen
                            ? 'rotate-180 text-brand-orange'
                            : 'text-brand-slate/40 group-hover:text-brand-orange'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headingId}
                    hidden={!isOpen}
                    className={`overflow-hidden transition-all duration-500 ${
                      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 pt-2">
                      <p className="leading-relaxed text-brand-slate/70">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Still have questions CTA */}
          <div
            className={`mt-16 rounded-3xl bg-gradient-to-br from-brand-orange to-brand-orange/80 p-8 text-center shadow-xl shadow-brand-orange/20 transition-all delay-1000 duration-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
          >
            <h3 className="mb-3 text-2xl font-bold text-white">Still have questions?</h3>
            <p className="mb-6 text-white/90">Our support team is here to help you get started</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
              <button className="rounded-xl bg-white px-6 py-3 font-semibold text-brand-orange shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                Contact Support
              </button>
              <button className="rounded-xl border-2 border-white bg-transparent px-6 py-3 font-semibold text-white transition-all hover:bg-white hover:text-brand-orange">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
