import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | Rouze.ai',
  description: 'Terms of Service for Rouze.ai - AI Agent Marketplace',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <h1 className="mb-8 text-4xl font-bold text-gray-900">Terms of Service</h1>

      <div className="space-y-8 text-gray-700">
        <section>
          <p className="mb-4 text-sm text-gray-600">Last Updated: January 14, 2026</p>
          <p className="leading-relaxed">
            Welcome to Rouze.ai. By accessing or using our AI Agent Marketplace platform, you agree
            to be bound by these Terms of Service. Please read them carefully.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
          <p className="leading-relaxed">
            By creating an account, purchasing agents, or using any part of our service, you agree
            to comply with and be bound by these Terms of Service and our Privacy Policy. If you do
            not agree to these terms, please do not use our platform.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">2. Description of Service</h2>
          <p className="mb-4 leading-relaxed">
            Rouze.ai is an AI Agent Marketplace that allows users to:
          </p>
          <ul className="ml-6 list-disc space-y-2 leading-relaxed">
            <li>Browse and purchase AI agent workflows</li>
            <li>Submit their own AI agents for sale (subject to approval)</li>
            <li>Download purchased agents and their associated files</li>
            <li>Review and rate purchased agents</li>
            <li>Request technical setup assistance</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">3. User Accounts</h2>
          <div className="space-y-3 leading-relaxed">
            <p className="font-medium">3.1 Account Creation</p>
            <p>
              You must create an account to purchase agents. You are responsible for maintaining the
              confidentiality of your account credentials and for all activities under your account.
            </p>
            <p className="font-medium">3.2 Account Security</p>
            <p>
              You agree to immediately notify us of any unauthorized use of your account or any
              other breach of security.
            </p>
            <p className="font-medium">3.3 Account Termination</p>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms or
              engage in fraudulent activity.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">4. Purchases and Payments</h2>
          <div className="space-y-3 leading-relaxed">
            <p className="font-medium">4.1 Payment Processing</p>
            <p>
              All payments are processed securely through Stripe. By making a purchase, you agree to
              Stripe&apos;s terms of service.
            </p>
            <p className="font-medium">4.2 Pricing</p>
            <p>
              All prices are listed in USD. We reserve the right to change prices at any time, but
              price changes will not affect purchases already made.
            </p>
            <p className="font-medium">4.3 Refunds</p>
            <p>
              Refund requests are handled according to our{' '}
              <Link href="/refund-policy" className="text-blue-600 hover:underline">
                Refund Policy
              </Link>
              . Generally, refunds are available within 14 days of purchase if the agent does not
              work as described.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">5. Agent Submissions</h2>
          <div className="space-y-3 leading-relaxed">
            <p className="font-medium">5.1 Seller Eligibility</p>
            <p>
              Users may submit AI agents for sale on our platform. All submissions are subject to
              admin approval.
            </p>
            <p className="font-medium">5.2 Content Requirements</p>
            <p>Submitted agents must:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Be original work or properly licensed</li>
              <li>Function as described in the listing</li>
              <li>Not contain malicious code or security vulnerabilities</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not infringe on intellectual property rights of others</li>
            </ul>
            <p className="font-medium">5.3 Revenue Sharing</p>
            <p>
              Revenue sharing terms between sellers and Rouze.ai are communicated separately and may
              vary by seller.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">6. Intellectual Property</h2>
          <div className="space-y-3 leading-relaxed">
            <p className="font-medium">6.1 Platform Content</p>
            <p>
              All content on Rouze.ai, including but not limited to text, graphics, logos, and
              software, is the property of Rouze.ai or its content suppliers and is protected by
              intellectual property laws.
            </p>
            <p className="font-medium">6.2 Purchased Agents</p>
            <p>
              When you purchase an agent, you receive a license to use that agent. The specific
              license terms are provided with each agent. You do not acquire ownership of the
              underlying intellectual property.
            </p>
            <p className="font-medium">6.3 Restrictions</p>
            <p>You may not:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Resell or redistribute purchased agents without authorization</li>
              <li>Reverse engineer or decompile agent code (unless permitted by license)</li>
              <li>Remove copyright or proprietary notices</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">7. Reviews and Ratings</h2>
          <div className="space-y-3 leading-relaxed">
            <p>
              Users who have purchased an agent may submit reviews. Reviews must be honest,
              accurate, and based on your actual experience. We reserve the right to remove reviews
              that:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Contain offensive or inappropriate content</li>
              <li>Are fraudulent or misleading</li>
              <li>Violate intellectual property rights</li>
              <li>Contain spam or promotional content</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">8. Setup Assistance</h2>
          <p className="leading-relaxed">
            We offer optional setup assistance for purchased agents. Setup assistance is provided on
            a best-effort basis and does not guarantee successful implementation in all
            environments. Additional terms may apply to setup assistance services.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            9. Disclaimers and Limitations
          </h2>
          <div className="space-y-3 leading-relaxed">
            <p className="font-medium">9.1 No Warranty</p>
            <p>
              THE SERVICE AND ALL AGENTS ARE PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY
              KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="font-medium">9.2 Limitation of Liability</p>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ROUZE.AI SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR
              REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
            </p>
            <p className="font-medium">9.3 AI Agent Performance</p>
            <p>
              AI agents may produce varying results depending on implementation, data, and usage
              context. We do not guarantee specific outcomes from using purchased agents.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">10. Privacy</h2>
          <p className="leading-relaxed">
            Your use of Rouze.ai is also governed by our Privacy Policy. We collect and use
            information as described in that policy.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">11. Prohibited Uses</h2>
          <div className="space-y-3 leading-relaxed">
            <p>You agree not to:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Use the platform for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the platform or servers</li>
              <li>Use automated tools to access the platform without permission</li>
              <li>Impersonate any person or entity</li>
              <li>Upload malicious code or viruses</li>
              <li>Engage in fraudulent activity or money laundering</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">12. Indemnification</h2>
          <p className="leading-relaxed">
            You agree to indemnify and hold harmless Rouze.ai, its officers, directors, employees,
            and agents from any claims, losses, damages, liabilities, and expenses arising from your
            use of the platform or violation of these terms.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">13. Changes to Terms</h2>
          <p className="leading-relaxed">
            We reserve the right to modify these Terms of Service at any time. Changes will be
            effective immediately upon posting. Your continued use of the platform after changes are
            posted constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">14. Governing Law</h2>
          <p className="leading-relaxed">
            These terms are governed by and construed in accordance with the laws of the United
            States, without regard to conflict of law principles.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">15. Contact Information</h2>
          <p className="leading-relaxed">
            If you have questions about these Terms of Service, please contact us through our
            support channels or via the contact information provided on our website.
          </p>
        </section>

        <section className="border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-600">
            By using Rouze.ai, you acknowledge that you have read, understood, and agree to be bound
            by these Terms of Service.
          </p>
        </section>
      </div>
    </div>
  )
}
