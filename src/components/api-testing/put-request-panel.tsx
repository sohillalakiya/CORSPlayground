'use client'

import { useState } from 'react'
import { RequestConfig, RequestHeader } from './request-config'
import { RequestBody, BodyType, FormDataItem } from './request-body'
import { ResponsePanel } from './response-panel'
import { Button } from '@/components/ui/button'
import { Send, Loader2 } from 'lucide-react'
import { ApiClient, ApiResponse, ApiError } from '@/lib/api-client'
import { toast } from 'sonner'

interface PutRequestPanelProps {
  url: string
  setUrl: (url: string) => void
  headers: RequestHeader[]
  setHeaders: (headers: RequestHeader[]) => void
}

export function PutRequestPanel({ url, setUrl, headers, setHeaders }: PutRequestPanelProps) {
  const [bodyType, setBodyType] = useState<BodyType>('json')
  const [jsonBody, setJsonBody] = useState('{\n  \n}')
  const [formData, setFormData] = useState<FormDataItem[]>([])
  const [rawBody, setRawBody] = useState('')
  const [rawContentType, setRawContentType] = useState('text/plain')
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const prepareRequestBody = () => {
    switch (bodyType) {
      case 'json':
        try {
          return JSON.parse(jsonBody)
        } catch {
          throw new Error('Invalid JSON in request body')
        }
      
      case 'form-data':
        const formDataObj: Record<string, string> = {}
        formData
          .filter(item => item.enabled && item.key)
          .forEach(item => {
            formDataObj[item.key] = item.value
          })
        return formDataObj
      
      case 'raw':
        return rawBody
      
      case 'none':
      default:
        return undefined
    }
  }

  const getContentType = () => {
    switch (bodyType) {
      case 'json':
        return 'application/json'
      case 'form-data':
        return 'multipart/form-data'
      case 'raw':
        return rawContentType
      default:
        return undefined
    }
  }

  const sendRequest = async () => {
    if (!url) {
      toast.error('Please enter a URL')
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

      // Add content type if not already present and body exists
      const contentType = getContentType()
      if (contentType && bodyType !== 'none' && !requestHeaders['Content-Type']) {
        requestHeaders['Content-Type'] = contentType
      }

      // Prepare request body
      const body = prepareRequestBody()

      // Make the request
      const result = await client.makeRequest({
        method: 'PUT',
        url,
        headers: requestHeaders,
        body
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
      <RequestConfig
        url={url}
        setUrl={setUrl}
        headers={headers}
        setHeaders={setHeaders}
      />

      <RequestBody
        bodyType={bodyType}
        setBodyType={setBodyType}
        jsonBody={jsonBody}
        setJsonBody={setJsonBody}
        formData={formData}
        setFormData={setFormData}
        rawBody={rawBody}
        setRawBody={setRawBody}
        rawContentType={rawContentType}
        setRawContentType={setRawContentType}
      />

      <div className="flex justify-end">
        <Button
          onClick={sendRequest}
          disabled={isLoading}
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
              Send Request
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