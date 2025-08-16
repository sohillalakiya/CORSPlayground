'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Copy, Download, Clock, FileText, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { ApiResponse } from '@/lib/api-client'

interface ResponsePanelProps {
  response: ApiResponse | null
  isLoading: boolean
  error: string | null
}

export function ResponsePanel({ response, isLoading, error }: ResponsePanelProps) {
  const [activeTab, setActiveTab] = useState('body')

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-500'
    if (status >= 300 && status < 400) return 'bg-yellow-500'
    if (status >= 400 && status < 500) return 'bg-orange-500'
    if (status >= 500) return 'bg-red-500'
    return 'bg-gray-500'
  }

  const copyToClipboard = (content: unknown) => {
    const text = typeof content === 'string' ? content : JSON.stringify(content, null, 2)
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const downloadResponse = () => {
    if (!response) return
    
    const content = typeof response.data === 'string' 
      ? response.data 
      : JSON.stringify(response.data, null, 2)
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `response-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatJson = (data: unknown): string => {
    try {
      if (typeof data === 'string') {
        return JSON.stringify(JSON.parse(data), null, 2)
      }
      return JSON.stringify(data, null, 2)
    } catch {
      return String(data)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
          <CardDescription>Sending request...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <span>Error</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!response) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
          <CardDescription>No response yet. Send a request to see results.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <p className="text-sm">Responses will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle>Response</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusColor(response.status)} text-white`}>
                {response.status} {response.statusText}
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{response.responseTime}ms</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <FileText className="h-3 w-3" />
                <span>{formatBytes(response.contentLength)}</span>
              </Badge>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => copyToClipboard(response.data)}>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button size="sm" variant="outline" onClick={downloadResponse}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          <TabsContent value="body" className="mt-4">
            <div className="bg-muted rounded-lg p-4 max-h-96 overflow-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap break-all">
                {response.contentType.includes('application/json')
                  ? formatJson(response.data)
                  : String(response.data)}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="headers" className="mt-4">
            <div className="space-y-2">
              {Object.entries(response.headers).map(([key, value]) => (
                <div key={key} className="flex items-start space-x-2 p-2 bg-muted rounded">
                  <span className="font-mono text-sm font-medium min-w-[200px]">{key}:</span>
                  <span className="font-mono text-sm break-all">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded">
                <p className="text-sm font-medium mb-1">Status</p>
                <p className="font-mono text-sm">{response.status} {response.statusText}</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="text-sm font-medium mb-1">Response Time</p>
                <p className="font-mono text-sm">{response.responseTime}ms</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="text-sm font-medium mb-1">Content Type</p>
                <p className="font-mono text-sm">{response.contentType || 'Not specified'}</p>
              </div>
              <div className="p-3 bg-muted rounded">
                <p className="text-sm font-medium mb-1">Content Length</p>
                <p className="font-mono text-sm">{formatBytes(response.contentLength)}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}