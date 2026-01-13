'use client'
import { logger } from '@/lib/logger'


import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Container } from '@/components/layout/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugAuthPage() {
    const [session, setSession] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function checkAuth() {
            // Get current session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession()
            setSession(session)

            if (sessionError) {
                logger.error('Session error:', sessionError)
            }

            // Get current user
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            setUser(user)

            if (userError) {
                logger.error('User error:', userError)
            }

            setLoading(false)
        }

        checkAuth()
    }, [])

    if (loading) {
        return (
            <Container className="py-12">
                <Card>
                    <CardHeader>
                        <CardTitle>Loading...</CardTitle>
                    </CardHeader>
                </Card>
            </Container>
        )
    }

    return (
        <Container className="py-12 space-y-6">
            <h1 className="text-3xl font-bold">Authentication Debug</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Session Status</CardTitle>
                </CardHeader>
                <CardContent>
                    {session ? (
                        <div className="space-y-2">
                            <p className="text-green-600 font-semibold">✅ Session Active</p>
                            <div className="bg-muted p-4 rounded-md text-sm font-mono overflow-auto max-h-96">
                                <pre>{JSON.stringify(session, null, 2)}</pre>
                            </div>
                        </div>
                    ) : (
                        <p className="text-red-600 font-semibold">❌ No Active Session</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>User Status</CardTitle>
                </CardHeader>
                <CardContent>
                    {user ? (
                        <div className="space-y-2">
                            <p className="text-green-600 font-semibold">✅ User Authenticated</p>
                            <div className="bg-muted p-4 rounded-md text-sm font-mono overflow-auto max-h-96">
                                <pre>{JSON.stringify(user, null, 2)}</pre>
                            </div>
                        </div>
                    ) : (
                        <p className="text-red-600 font-semibold">❌ No User Authenticated</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Cookies</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted p-4 rounded-md text-sm font-mono">
                        <p>{document.cookie || 'No cookies found'}</p>
                    </div>
                </CardContent>
            </Card>
        </Container>
    )
}
