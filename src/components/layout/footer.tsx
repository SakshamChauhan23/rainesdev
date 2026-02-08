import Link from 'next/link'
import Image from 'next/image'
import { Container } from './container'

export function Footer() {
  return (
    <footer className="border-t border-brand-slate/10 bg-white">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {/* Categories */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-brand-slate">Categories</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/agents?category=customer-support"
                    className="text-brand-slate/70 transition-colors hover:text-brand-orange"
                  >
                    Customer Support
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:team@rouze.ai"
                    className="text-brand-slate/70 transition-colors hover:text-brand-orange"
                  >
                    Sales & Marketing
                  </a>
                </li>
                <li>
                  <Link
                    href="/agents?category=data-analysis"
                    className="text-brand-slate/70 transition-colors hover:text-brand-orange"
                  >
                    Data Analysis
                  </Link>
                </li>
                <li>
                  <Link
                    href="/agents?category=content-creation"
                    className="text-brand-slate/70 transition-colors hover:text-brand-orange"
                  >
                    Content Creation
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Clients */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-brand-slate">For Clients</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/agents"
                    className="text-brand-slate/70 transition-colors hover:text-brand-orange"
                  >
                    Browse Agents
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#how-it-works"
                    className="text-brand-slate/70 transition-colors hover:text-brand-orange"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/library"
                    className="text-brand-slate/70 transition-colors hover:text-brand-orange"
                  >
                    Your Purchases
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Sellers */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-brand-slate">For Sellers</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/become-seller"
                    className="text-brand-slate/70 transition-colors hover:text-brand-orange"
                  >
                    Become a Seller
                  </Link>
                </li>
                <li>
                  <Link
                    href="/submit-agent"
                    className="text-brand-slate/70 transition-colors hover:text-brand-orange"
                  >
                    Submit Agent
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-brand-slate/70 transition-colors hover:text-brand-orange"
                  >
                    Seller Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-brand-slate">Company</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-brand-slate/70 transition-colors hover:text-brand-orange"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/privacy"
                    className="text-brand-slate/70 transition-colors hover:text-brand-orange"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/terms"
                    className="text-brand-slate/70 transition-colors hover:text-brand-orange"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-6 border-t border-brand-slate/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <Link href="/" className="transition-transform hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Rouze.ai"
                  width={160}
                  height={45}
                  className="h-12 w-auto"
                />
              </Link>
            </div>
            <span className="text-sm text-brand-slate/60">
              © {new Date().getFullYear()} Rouze.ai. All rights reserved.
            </span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
