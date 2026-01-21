import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | Rouze.ai',
  description: 'Privacy Policy for Rouze.ai - AI Agent Marketplace',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <h1 className="mb-8 text-4xl font-bold text-gray-900">Privacy Policy</h1>

      <div className="space-y-8 text-gray-700">
        <section>
          <p className="mb-4 text-sm text-gray-600">Last Updated: January 21, 2026</p>
          <p className="leading-relaxed">
            At Rouze.ai (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to
            protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you use our AI Agent Marketplace platform.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">1. Information We Collect</h2>

          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium text-gray-900">1.1 Personal Information</h3>
              <p className="mb-2 leading-relaxed">
                When you create an account or make a purchase, we may collect:
              </p>
              <ul className="ml-6 list-disc space-y-2 leading-relaxed">
                <li>Name and email address</li>
                <li>Account credentials (securely hashed)</li>
                <li>Payment information (processed by Stripe)</li>
                <li>Profile information you choose to provide</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-gray-900">1.2 Usage Information</h3>
              <p className="mb-2 leading-relaxed">We automatically collect:</p>
              <ul className="ml-6 list-disc space-y-2 leading-relaxed">
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>IP address</li>
                <li>Pages visited and features used</li>
                <li>Time and date of visits</li>
                <li>Referring website addresses</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-gray-900">1.3 Cookies and Tracking</h3>
              <p className="leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze usage
                patterns, and provide personalized content. You can control cookies through your
                browser settings.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            2. How We Use Your Information
          </h2>
          <p className="mb-4 leading-relaxed">We use the information we collect to:</p>
          <ul className="ml-6 list-disc space-y-2 leading-relaxed">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Detect, investigate, and prevent fraudulent transactions and abuse</li>
            <li>Personalize and improve your experience</li>
            <li>Send promotional communications (with your consent)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            3. Information Sharing and Disclosure
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium text-gray-900">3.1 Service Providers</h3>
              <p className="leading-relaxed">
                We share information with third-party service providers who perform services on our
                behalf, including payment processing (Stripe), authentication (Supabase), hosting,
                and analytics.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-gray-900">3.2 Sellers</h3>
              <p className="leading-relaxed">
                When you purchase an agent, the seller may receive your name and email address to
                provide support and communicate about your purchase.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-gray-900">3.3 Legal Requirements</h3>
              <p className="leading-relaxed">
                We may disclose information if required by law, legal process, or government
                request, or when we believe disclosure is necessary to protect our rights, your
                safety, or the safety of others.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-gray-900">3.4 Business Transfers</h3>
              <p className="leading-relaxed">
                If we are involved in a merger, acquisition, or sale of assets, your information may
                be transferred as part of that transaction.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">4. Data Security</h2>
          <p className="leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal
            information against unauthorized access, alteration, disclosure, or destruction.
            However, no method of transmission over the Internet or electronic storage is 100%
            secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">5. Data Retention</h2>
          <p className="leading-relaxed">
            We retain your personal information for as long as your account is active or as needed
            to provide services. We may also retain certain information as required by law, to
            resolve disputes, enforce agreements, or for legitimate business purposes.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">6. Your Rights and Choices</h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium text-gray-900">6.1 Account Information</h3>
              <p className="leading-relaxed">
                You can update your account information at any time by logging into your account
                settings. You may also request deletion of your account by contacting us.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-gray-900">6.2 Marketing Communications</h3>
              <p className="leading-relaxed">
                You can opt out of promotional emails by clicking the &quot;unsubscribe&quot; link
                in any email. Note that you may still receive transactional emails about your
                account or purchases.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-gray-900">6.3 Cookies</h3>
              <p className="leading-relaxed">
                Most browsers allow you to refuse or delete cookies. If you choose to do so, some
                features of our platform may not function properly.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-gray-900">6.4 Data Access and Portability</h3>
              <p className="leading-relaxed">
                You have the right to request access to your personal data and receive it in a
                portable format. Contact us to make such a request.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            7. International Data Transfers
          </h2>
          <p className="leading-relaxed">
            Your information may be transferred to and processed in countries other than your
            country of residence. These countries may have different data protection laws. We take
            steps to ensure your information receives adequate protection in accordance with this
            policy.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">8. Children&apos;s Privacy</h2>
          <p className="leading-relaxed">
            Our platform is not intended for children under 16 years of age. We do not knowingly
            collect personal information from children under 16. If we learn we have collected
            information from a child under 16, we will delete that information.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            9. Third-Party Services and Links
          </h2>
          <p className="leading-relaxed">
            Our platform may contain links to third-party websites or services. We are not
            responsible for the privacy practices of these third parties. We encourage you to review
            their privacy policies before providing any information.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            10. Changes to This Privacy Policy
          </h2>
          <p className="leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of significant
            changes by posting the new policy on this page and updating the &quot;Last Updated&quot;
            date. We encourage you to review this policy periodically.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            11. California Privacy Rights
          </h2>
          <p className="leading-relaxed">
            California residents may have additional rights under the California Consumer Privacy
            Act (CCPA), including the right to know what personal information we collect, the right
            to delete personal information, and the right to opt out of the sale of personal
            information. We do not sell personal information. To exercise your rights, contact us
            using the information below.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">12. Contact Us</h2>
          <p className="leading-relaxed">
            If you have questions or concerns about this Privacy Policy or our data practices,
            please contact us at:
          </p>
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <p className="font-medium">Rouze.ai</p>
            <p>Email: privacy@rouze.ai</p>
          </div>
        </section>

        <section className="border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-600">
            By using Rouze.ai, you acknowledge that you have read and understood this Privacy
            Policy.
          </p>
        </section>
      </div>
    </div>
  )
}
