
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signupAction } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Container } from '@/components/layout/container'
import { AlertCircle, CheckCircle2, Loader2, Info } from 'lucide-react'

export default function SignupPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [requiresEmailConfirmation, setRequiresEmailConfirmation] = useState(false)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const result = await signupAction(email, password, name || undefined)

            if (!result.success) {
                setError(result.error || 'Signup failed')
                return
            }

            setSuccess(true)
            setRequiresEmailConfirmation(result.requiresEmailConfirmation || false)

            // Auto-redirect after appropriate delay
            const redirectDelay = result.requiresEmailConfirmation ? 5000 : 2000
            setTimeout(() => {
                // Use window.location for hard redirect to ensure session is properly loaded
                window.location.href = result.redirectUrl || '/agents'
            }, redirectDelay)
        } catch (err: any) {
            setError(err.message || 'Signup failed')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <Container className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            {requiresEmailConfirmation ? 'Check Your Email' : 'Welcome! 🎉'}
                        </CardTitle>
                        <CardDescription>
                            {requiresEmailConfirmation ? (
                                <>
                                    We&apos;ve sent a confirmation link to <strong>{email}</strong>
                                </>
                            ) : (
                                <>Your account has been created as a <strong>Buyer</strong></>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {requiresEmailConfirmation ? (
                            <>
                                <div className="text-center text-sm text-muted-foreground">
                                    Click the link in the email to verify your account before logging in.
                                </div>
                                <div className="text-center">
                                    <Button asChild>
                                        <Link href="/login">Go to Login</Link>
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-center text-sm text-muted-foreground">
                                    Redirecting you to the marketplace...
                                </div>
                                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                                    <div className="flex gap-2 mb-2">
                                        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-blue-900">
                                            <p className="font-semibold mb-1">Want to sell AI agents?</p>
                                            <p className="text-xs text-blue-700">
                                                Contact admin to upgrade your account to Seller role and start listing your agents.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </Container>
        )
    }

    return (
        <Container className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <span>{error}</span>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                minLength={6}
                                placeholder="Minimum 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                            <p>• New accounts start as <strong>Buyer</strong> role</p>
                            <p>• Contact admin to become a <strong>Seller</strong></p>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create account
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </Container>
    )
}
