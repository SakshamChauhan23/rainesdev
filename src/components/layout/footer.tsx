import Link from 'next/link'
import { Container } from './container'
import { Bot } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-300 bg-white">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            {/* Categories */}
            <div>
              <h3 className="mb-4 text-sm font-normal text-black">Categories</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/agents?category=customer-support" className="font-light text-gray-700 transition-colors hover:text-[#8DEC42]">
                    Customer Support
                  </Link>
                </li>
                <li>
                  <Link href="/agents?category=sales-marketing" className="font-light text-gray-700 transition-colors hover:text-[#8DEC42]">
                    Sales & Marketing
                  </Link>
                </li>
                <li>
                  <Link href="/agents?category=data-analysis" className="font-light text-gray-700 transition-colors hover:text-[#8DEC42]">
                    Data Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/agents?category=content-creation" className="font-light text-gray-700 transition-colors hover:text-[#8DEC42]">
                    Content Creation
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Clients */}
            <div>
              <h3 className="mb-4 text-sm font-normal text-black">For Clients</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/agents" className="font-light text-gray-700 transition-colors hover:text-[#8DEC42]">
                    Browse Agents
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="font-light text-gray-700 transition-colors hover:text-[#8DEC42]">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/library" className="font-light text-gray-700 transition-colors hover:text-[#8DEC42]">
                    Your Purchases
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Sellers */}
            <div>
              <h3 className="mb-4 text-sm font-normal text-black">For Sellers</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/signup" className="font-light text-gray-700 transition-colors hover:text-[#8DEC42]">
                    Become a Seller
                  </Link>
                </li>
                <li>
                  <Link href="/submit-agent" className="font-light text-gray-700 transition-colors hover:text-[#8DEC42]">
                    Submit Agent
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="font-light text-gray-700 transition-colors hover:text-[#8DEC42]">
                    Seller Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Business Solutions */}
            <div>
              <h3 className="mb-4 text-sm font-normal text-black">Business Solutions</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/enterprise" className="font-light text-gray-700 transition-colors hover:text-[#8DEC42]">
                    Enterprise
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="font-light text-gray-700 transition-colors hover:text-[#8DEC42]">
                    Contact Sales
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-4 text-sm font-normal text-black">Company</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/about" className="font-light text-gray-700 transition-colors hover:text-[#8DEC42]">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="font-light text-gray-700 transition-colors hover:text-[#8DEC42]">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms" className="font-light text-gray-700 transition-colors hover:text-[#8DEC42]">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-gray-300 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-gray-600" />
              <div className="flex flex-col">
                <span className="text-sm font-normal text-black">Neura</span>
                <span className="text-xs font-light text-gray-600">powered by RainesDev</span>
              </div>
            </div>
            <span className="text-sm font-light text-gray-600">
              © {new Date().getFullYear()} All rights reserved
            </span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
