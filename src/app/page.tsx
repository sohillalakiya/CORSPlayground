import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Session } from 'next-auth'

export default async function HomePage() {
  const session = await getServerSession(authOptions) as Session | null

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back{session.user?.name ? `, ${session.user.name}` : ''}!</h2>
            <p className="text-muted-foreground mt-2">
              Test and document your REST API endpoints with ease
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Quick Start</CardTitle>
                <CardDescription>Get started with API testing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">1. Configure your base URL</p>
                  <p className="text-sm">2. Select HTTP method</p>
                  <p className="text-sm">3. Add headers and body</p>
                  <p className="text-sm">4. Send request</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supported Methods</CardTitle>
                <CardDescription>All REST API methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-500 text-white">GET</Badge>
                  <Badge className="bg-blue-500 text-white">POST</Badge>
                  <Badge className="bg-yellow-500 text-white">PUT</Badge>
                  <Badge className="bg-red-500 text-white">DELETE</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Test endpoint available at: /api/test
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>Powerful testing capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">✓ Custom headers</p>
                  <p className="text-sm">✓ Authentication support</p>
                  <p className="text-sm">✓ Response analysis</p>
                  <p className="text-sm">✓ Auto documentation</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>API Testing Interface</CardTitle>
              <CardDescription>
                Start testing your APIs now
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The API testing interface is now fully functional with support for all HTTP methods (GET, POST, PUT, DELETE).
                Configure your environment, add headers, request bodies, and start testing!
              </p>
              <a href="/api-testing">
                <button className="w-full mt-5 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md">
                  Open API Testing Interface
                </button>
              </a>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}