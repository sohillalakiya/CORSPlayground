import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Header } from '@/components/layout/header'
import { EnvironmentConfig } from '@/components/api-testing/environment-config'
import { MethodTabs } from '@/components/api-testing/method-tabs'

export default async function ApiTestingPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">API Testing Interface</h2>
            <p className="text-muted-foreground mt-2">
              Test and debug your REST API endpoints with full customization
            </p>
          </div>

          <EnvironmentConfig />
          
          <MethodTabs />
        </div>
      </main>
    </div>
  )
}