'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Save, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { CorsProxyToggle } from './cors-proxy-toggle'

export function EnvironmentConfig() {
  const [baseUrl, setBaseUrl] = useState('')
  const [corsProxyEnabled, setCorsProxyEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load saved base URL from session storage
    const savedUrl = sessionStorage.getItem('corsplayground-baseurl')
    if (savedUrl) {
      setBaseUrl(savedUrl)
    }
    
    // Load CORS proxy preference
    const savedCorsProxy = sessionStorage.getItem('corsplayground-cors-proxy')
    if (savedCorsProxy !== null) {
      setCorsProxyEnabled(savedCorsProxy === 'true')
    }
  }, [])

  const handleSaveEnvironment = () => {
    setIsLoading(true)
    
    try {
      // Validate URL format
      if (baseUrl && !baseUrl.match(/^https?:\/\//)) {
        toast.error('Please enter a valid URL starting with http:// or https://')
        setIsLoading(false)
        return
      }

      // Save to session storage
      sessionStorage.setItem('corsplayground-baseurl', baseUrl)
      sessionStorage.setItem('corsplayground-cors-proxy', corsProxyEnabled.toString())
      toast.success('Environment configuration saved')
    } catch {
      toast.error('Failed to save environment configuration')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleCorsProxyToggle = (enabled: boolean) => {
    setCorsProxyEnabled(enabled)
    sessionStorage.setItem('corsplayground-cors-proxy', enabled.toString())
    toast.success(`CORS proxy ${enabled ? 'enabled' : 'disabled'}`)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Environment Configuration</CardTitle>
          <CardDescription>
            Set your API base URL to use for all requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="baseUrl">Base URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="baseUrl"
                  type="url"
                  placeholder="https://api.example.com"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSaveEnvironment}
                  disabled={isLoading}
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                This URL will be used as the base for all API requests
              </p>
            </div>
            
            {!baseUrl && (
              <div className="flex items-center space-x-2 text-sm text-yellow-600 dark:text-yellow-400">
                <AlertCircle className="h-4 w-4" />
                <span>No base URL configured. You can still use full URLs in requests.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <CorsProxyToggle 
        enabled={corsProxyEnabled}
        onToggle={handleCorsProxyToggle}
      />
    </div>
  )
}