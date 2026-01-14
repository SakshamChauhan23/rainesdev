import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Refund Policy | Rouze.ai',
  description: 'Refund Policy for Rouze.ai - AI Agent Marketplace',
}

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <h1 className="mb-8 text-4xl font-bold text-gray-900">Refund Policy</h1>

      <div className="space-y-8 text-gray-700">
        <section>
          <p className="mb-4 text-sm text-gray-600">Last Updated: January 14, 2026</p>
          <p className="leading-relaxed">
            At Rouze.ai, we want you to be completely satisfied with your purchase. This Refund
            Policy outlines the conditions and procedures for requesting refunds on AI agent
            purchases.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">1. Refund Eligibility</h2>
          <div className="space-y-3 leading-relaxed">
            <p className="font-medium">1.1 Timeframe</p>
            <p>
              Refund requests must be submitted within <strong>14 days</strong> of the purchase
              date. Requests submitted after this period will not be eligible for a refund.
            </p>
            <p className="font-medium">1.2 Valid Reasons for Refunds</p>
            <p>Refunds may be granted if:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>The agent does not function as described in the listing</li>
              <li>The agent contains critical bugs that prevent its use</li>
              <li>Required files or documentation are missing or incomplete</li>
              <li>The agent is fundamentally incompatible with the advertised platforms</li>
              <li>You received a duplicate charge for the same purchase</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">2. Non-Refundable Cases</h2>
          <div className="space-y-3 leading-relaxed">
            <p>Refunds will NOT be granted in the following situations:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>You changed your mind after downloading the agent</li>
              <li>You lack the technical skills to implement the agent</li>
              <li>
                The agent does not meet your specific use case (if not explicitly promised in the
                description)
              </li>
              <li>You found a similar agent elsewhere at a lower price</li>
              <li>You have already used the agent in a production environment</li>
              <li>More than 14 days have passed since purchase</li>
              <li>You violated the agent&apos;s license terms or our Terms of Service</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">3. How to Request a Refund</h2>
          <div className="space-y-3 leading-relaxed">
            <p className="font-medium">3.1 Contact Support</p>
            <p>
              To request a refund, please contact our support team with the following information:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Your order number or transaction ID</li>
              <li>The name of the agent you purchased</li>
              <li>Date of purchase</li>
              <li>Detailed explanation of why you are requesting a refund</li>
              <li>
                Any supporting evidence (screenshots, error messages, etc.) that demonstrates the
                issue
              </li>
            </ul>
            <p className="font-medium">3.2 Review Process</p>
            <p>
              Our team will review your refund request within <strong>3-5 business days</strong>. We
              may contact you for additional information or to offer alternative solutions such as:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Technical support to resolve implementation issues</li>
              <li>Access to updated versions of the agent</li>
              <li>Credit toward a different agent that better suits your needs</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">4. Refund Processing</h2>
          <div className="space-y-3 leading-relaxed">
            <p className="font-medium">4.1 Approval</p>
            <p>
              If your refund request is approved, the refund will be processed to your original
              payment method within <strong>7-10 business days</strong>.
            </p>
            <p className="font-medium">4.2 Partial Refunds</p>
            <p>
              In some cases, we may offer a partial refund if you have partially benefited from the
              agent but experienced significant issues.
            </p>
            <p className="font-medium">4.3 Processing Time</p>
            <p>
              Please note that depending on your payment provider, it may take an additional 3-5
              business days for the refund to appear in your account after we process it.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            5. Access Revocation After Refund
          </h2>
          <p className="leading-relaxed">
            Once a refund is processed, your access to the agent and any associated files will be
            revoked. You must permanently delete all copies of the agent from your systems and cease
            any use of the agent.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">6. Setup Assistance Refunds</h2>
          <div className="space-y-3 leading-relaxed">
            <p>
              If you purchased optional setup assistance in addition to an agent, refunds for setup
              assistance are handled separately:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                If setup assistance has not yet been provided, it may be refunded along with the
                agent
              </li>
              <li>
                If setup assistance has been partially provided, only the unused portion may be
                eligible for refund
              </li>
              <li>Setup assistance that has been fully delivered is non-refundable</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">7. Dispute Resolution</h2>
          <div className="space-y-3 leading-relaxed">
            <p className="font-medium">7.1 Internal Review</p>
            <p>
              If you disagree with a refund decision, you may request an internal review by
              escalating your case to our management team.
            </p>
            <p className="font-medium">7.2 Chargeback Notice</p>
            <p>
              Before initiating a chargeback with your payment provider, please contact us to
              resolve the issue. Chargebacks may result in account suspension and may affect your
              ability to make future purchases on our platform.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            8. Agent Updates and Support
          </h2>
          <p className="leading-relaxed">
            Before requesting a refund, please note that many issues can be resolved through:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>Checking for agent updates (agents are regularly updated by sellers)</li>
            <li>Reviewing the agent documentation and README files</li>
            <li>Contacting our support team for technical assistance</li>
            <li>Requesting setup assistance (available for purchase)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">9. Exceptions</h2>
          <div className="space-y-3 leading-relaxed">
            <p>We reserve the right to make exceptions to this policy in the following cases:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>If we discover a critical defect in an agent after it has been sold</li>
              <li>If an agent is removed from our platform due to policy violations</li>
              <li>In cases of fraud or unauthorized charges</li>
              <li>At our discretion for extenuating circumstances</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">10. Policy Changes</h2>
          <p className="leading-relaxed">
            We reserve the right to modify this Refund Policy at any time. Changes will be effective
            immediately upon posting. Refund requests will be evaluated based on the policy in
            effect at the time of purchase.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">11. Contact Information</h2>
          <div className="space-y-3 leading-relaxed">
            <p>To request a refund or for questions about this policy, please contact us at:</p>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="font-medium">Support Team</p>
              <p>
                Use the contact form on our website or book a call at{' '}
                <Link
                  href={process.env.NEXT_PUBLIC_BOOKING_CALENDAR_URL || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  our booking calendar
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200 pt-8">
          <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
            <p className="font-medium text-blue-900">Our Commitment</p>
            <p className="mt-2 text-blue-800">
              We stand behind the quality of the AI agents on our marketplace. Our goal is to ensure
              you have a positive experience. If you encounter any issues, please reach out to us
              before the 14-day window expires so we can help resolve any problems.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
