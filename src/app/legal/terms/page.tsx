import { redirect } from 'next/navigation'

// Redirect /legal/terms to /terms for consistency
export default function LegalTermsRedirect() {
  redirect('/terms')
}
