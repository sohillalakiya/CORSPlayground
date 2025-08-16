'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Shield, ShieldOff, InfoIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface CorsProxyToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

export function CorsProxyToggle({ enabled, onToggle }: CorsProxyToggleProps) {
  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">CORS Proxy</CardTitle>
            <Badge variant={enabled ? "default" : "secondary"}>
              {enabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <Switch
            id="cors-proxy"
            checked={enabled}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
        <CardDescription className="mt-2">
          Control whether requests go through the CORS proxy or directly to the target server
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start space-x-2">
          {enabled ? (
            <>
              <Shield className="h-5 w-5 text-green-500 mt-0.5" />
              <div className="space-y-1 text-sm">
                <p className="font-medium text-green-600 dark:text-green-400">
                  Proxy Mode Active
                </p>
                <p className="text-muted-foreground">
                  Requests are routed through the server-side proxy, bypassing browser CORS restrictions.
                  You can access any API regardless of CORS settings.
                </p>
              </div>
            </>
          ) : (
            <>
              <ShieldOff className="h-5 w-5 text-orange-500 mt-0.5" />
              <div className="space-y-1 text-sm">
                <p className="font-medium text-orange-600 dark:text-orange-400">
                  Direct Mode Active
                </p>
                <p className="text-muted-foreground">
                  Requests go directly from your browser to the target server.
                  CORS policies will be enforced - the server must allow origin {typeof window !== 'undefined' ? window.location.origin : 'your domain'}.
                </p>
              </div>
            </>
          )}
        </div>
        
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <InfoIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <strong>When to use proxy:</strong> Testing APIs during development, accessing third-party APIs without CORS headers.
              </p>
              <p>
                <strong>When to disable proxy:</strong> Testing your CORS configuration, production environment simulation.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}