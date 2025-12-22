import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function UnauthorizedPage() {
    return (
        <Container className="flex min-h-[60vh] flex-col items-center justify-center py-12">
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-destructive/10 p-4">
                    <ShieldAlert className="h-12 w-12 text-destructive" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
                <p className="text-muted-foreground max-w-md">
                    You don't have permission to access this page. Admin privileges are required.
                </p>
                <div className="flex gap-3 pt-4">
                    <Button variant="outline" asChild>
                        <Link href="/">Go Home</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                </div>
            </div>
        </Container>
    )
}
