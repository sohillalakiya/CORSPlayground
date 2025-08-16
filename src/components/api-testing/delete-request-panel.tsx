'use client'

import { useState } from 'react'
import { RequestConfig, RequestHeader } from './request-config'
import { ResponsePanel } from './response-panel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, Loader2, AlertTriangle } from 'lucide-react'
import { ApiClient, ApiResponse, ApiError } from '@/lib/api-client'
import { toast } from 'sonner'

interface DeleteRequestPanelProps {
  url: string
  setUrl: (url: string) => void
  headers: RequestHeader[]
  setHeaders: (headers: RequestHeader[]) => void
}

export function DeleteRequestPanel({ url, setUrl, headers, setHeaders }: DeleteRequestPanelProps) {
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendRequest = async () => {
    if (!url) {
      toast.error('Please enter a URL')
      return
    }

    // Show confirmation dialog for DELETE requests
    if (!confirm('Are you sure you want to send a DELETE request? This action may permanently remove data.')) {
      return
    }

    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      // Get base URL and CORS proxy setting from session storage
      const baseUrl = sessionStorage.getItem('corsplayground-baseurl') || ''
      const useProxy = sessionStorage.getItem('corsplayground-cors-proxy') !== 'false'
      const client = new ApiClient(baseUrl, useProxy)

      // Build headers object from enabled headers
      const requestHeaders: Record<string, string> = {}
      headers
        .filter(h => h.enabled && h.key)
        .forEach(h => {
          requestHeaders[h.key] = h.value
        })

      // Make the request
      const result = await client.makeRequest({
        method: 'DELETE',
        url,
        headers: requestHeaders
      })

      setResponse(result)
      toast.success('Request successful')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
        if (err.response) {
          // Still show the error response
          setResponse({
            status: err.statusCode || 0,
            statusText: 'Error',
            headers: {},
            data: err.response,
            responseTime: 0,
            contentLength: 0,
            contentType: 'application/json'
          })
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
        setError(errorMessage)
        
        // Check if it's likely a CORS error
        if (errorMessage.includes('Failed to fetch') && !sessionStorage.getItem('corsplayground-cors-proxy')) {
          setError(`${errorMessage}. This might be a CORS error. Try enabling the CORS proxy.`)
        }
      }
      toast.error('Request failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <span>DELETE Request Warning</span>
          </CardTitle>
          <CardDescription>
            DELETE requests permanently remove resources. Use with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This method is typically used to delete resources on the server. 
            Make sure you have the correct URL and authorization before proceeding.
          </p>
        </CardContent>
      </Card>

      <RequestConfig
        url={url}
        setUrl={setUrl}
        headers={headers}
        setHeaders={setHeaders}
      />

      <div className="flex justify-end">
        <Button
          onClick={sendRequest}
          disabled={isLoading}
          variant="destructive"
          className="min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send DELETE
            </>
          )}
        </Button>
      </div>

      <ResponsePanel
        response={response}
        isLoading={isLoading}
        error={error}
      />
    </div>
  )
}