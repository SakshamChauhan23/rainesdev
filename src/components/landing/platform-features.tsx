'use client'

import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useRef } from 'react'
import {
  ShoppingCart,
  Store,
  Search,
  CreditCard,
  Settings,
  TrendingUp,
  BarChart3,
  Users,
  MessageSquare,
  Shield,
  Zap,
  CheckCircle2,
} from 'lucide-react'

export function PlatformFeatures() {
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer')
  const [isVisible, setIsVisible] = useState(false)
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

  const buyerFeatures = [
    {
      icon: Search,
      title: 'Discover AI Agents',
      description:
        'Browse our curated marketplace of ready-to-deploy AI agents for every business need',
      color: 'orange',
    },
    {
      icon: Shield,
      title: 'Verified & Tested',
      description: 'All agents are thoroughly tested and verified before listing on our platform',
      color: 'teal',
    },
    {
      icon: CreditCard,
      title: 'Simple Pricing',
      description: 'Transparent, one-time or subscription pricing with no hidden fees',
      color: 'orange',
    },
    {
      icon: Zap,
      title: 'Instant Deployment',
      description: 'Get your AI agent up and running in minutes with simple setup',
      color: 'teal',
    },
    {
      icon: Settings,
      title: 'Easy Configuration',
      description: 'No coding required - configure your agent through an intuitive interface',
      color: 'orange',
    },
    {
      icon: MessageSquare,
      title: 'Review & Rate',
      description: 'Share your experience and help others make informed decisions',
      color: 'teal',
    },
  ]

  const sellerFeatures = [
    {
      icon: Store,
      title: 'List Your Agents',
      description: 'Easily publish and manage your AI agents on our global marketplace',
      color: 'orange',
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Revenue',
      description: 'Reach thousands of potential customers and scale your business',
      color: 'teal',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track sales, performance metrics, and customer insights in real-time',
      color: 'orange',
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Manage customer relationships and support tickets efficiently',
      color: 'teal',
    },
    {
      icon: CheckCircle2,
      title: 'Quality Assurance',
      description: 'Our team helps ensure your agents meet marketplace standards',
      color: 'orange',
    },
    {
      icon: MessageSquare,
      title: 'Customer Feedback',
      description: 'Get valuable feedback and reviews to improve your products',
      color: 'teal',
    },
  ]

  const features = activeTab === 'buyer' ? buyerFeatures : sellerFeatures

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-20 sm:py-28 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/4 h-96 w-96 rounded-full bg-brand-orange/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-brand-orange/5 blur-3xl" />
      </div>

      <Container>
        {/* Section Header */}
        <div
          className={`mx-auto mb-16 max-w-3xl text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-brand-slate sm:text-4xl md:text-5xl">
            Platform{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-brand-orange">Features</span>
              <span className="absolute bottom-2 left-0 right-0 -z-0 h-3 bg-brand-orange/20" />
            </span>
          </h2>
          <p className="text-lg text-brand-slate/70 sm:text-xl">
            Whether you&apos;re buying or selling, we&apos;ve got you covered
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          className={`mx-auto mb-12 flex w-fit rounded-2xl bg-brand-cream p-2 shadow-lg transition-all delay-200 duration-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        >
          <button
            onClick={() => setActiveTab('buyer')}
            className={`group relative rounded-xl px-8 py-4 text-sm font-semibold transition-all duration-300 ${
              activeTab === 'buyer'
                ? 'bg-white text-brand-orange shadow-md'
                : 'text-brand-slate/60 hover:text-brand-orange'
            }`}
          >
            <ShoppingCart
              className={`mb-1 inline-block h-5 w-5 transition-transform ${activeTab === 'buyer' ? 'scale-110' : 'group-hover:scale-110'}`}
            />
            <span className="ml-2">For Buyers</span>
            {activeTab === 'buyer' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-brand-orange" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('seller')}
            className={`group relative rounded-xl px-8 py-4 text-sm font-semibold transition-all duration-300 ${
              activeTab === 'seller'
                ? 'bg-white text-brand-orange shadow-md'
                : 'text-brand-slate/60 hover:text-brand-orange'
            }`}
          >
            <Store
              className={`mb-1 inline-block h-5 w-5 transition-transform ${activeTab === 'seller' ? 'scale-110' : 'group-hover:scale-110'}`}
            />
            <span className="ml-2">For Sellers</span>
            {activeTab === 'seller' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-brand-orange" />
            )}
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isOrange = feature.color === 'orange'

            return (
              <div
                key={`${activeTab}-${index}`}
                className={`group rounded-3xl border border-brand-slate/5 bg-brand-cream/50 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-xl ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div
                  className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                    isOrange
                      ? 'bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white'
                      : 'bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white'
                  }`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-brand-slate">{feature.title}</h3>
                <p className="leading-relaxed text-brand-slate/70">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div
          className={`mt-16 text-center transition-all delay-700 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <Button
            size="lg"
            className="group rounded-2xl bg-brand-orange px-8 py-6 text-base font-semibold text-white shadow-lg shadow-brand-orange/30 transition-all hover:-translate-y-0.5 hover:bg-brand-orange/90 hover:shadow-xl hover:shadow-brand-orange/40"
          >
            {activeTab === 'buyer' ? 'Browse AI Agents' : 'Start Selling'}
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Button>
        </div>
      </Container>
    </section>
  )
}
