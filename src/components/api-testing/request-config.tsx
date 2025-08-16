'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Code, List } from 'lucide-react'

export interface RequestHeader {
  key: string
  value: string
  enabled: boolean
}

export interface RequestConfigProps {
  url: string
  setUrl: (url: string) => void
  headers: RequestHeader[]
  setHeaders: (headers: RequestHeader[]) => void
}

export function RequestConfig({ url, setUrl, headers, setHeaders }: RequestConfigProps) {
  const [headerInputMode, setHeaderInputMode] = useState<'key-value' | 'json'>('key-value')
  const [jsonHeaders, setJsonHeaders] = useState('{}')

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }])
  }

  const updateHeader = (index: number, field: keyof RequestHeader, value: string | boolean) => {
    const newHeaders = [...headers]
    newHeaders[index] = { ...newHeaders[index], [field]: value }
    setHeaders(newHeaders)
  }

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index))
  }

  const switchToJson = () => {
    const headerObj: Record<string, string> = {}
    headers
      .filter(h => h.enabled && h.key)
      .forEach(h => {
        headerObj[h.key] = h.value
      })
    setJsonHeaders(JSON.stringify(headerObj, null, 2))
    setHeaderInputMode('json')
  }

  const switchToKeyValue = () => {
    try {
      const parsed = JSON.parse(jsonHeaders)
      const newHeaders: RequestHeader[] = Object.entries(parsed).map(([key, value]) => ({
        key,
        value: value as string,
        enabled: true
      }))
      setHeaders(newHeaders)
      setHeaderInputMode('key-value')
    } catch {
      // Keep current headers if JSON is invalid
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Configuration</CardTitle>
        <CardDescription>
          Configure your API request URL and headers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* URL Input */}
        <div className="space-y-2">
          <Label htmlFor="url">Request URL</Label>
          <Input
            id="url"
            placeholder="/api/users or https://api.example.com/users"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Enter a relative path to use with base URL, or a full URL
          </p>
        </div>

        {/* Headers Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Headers</Label>
            <div className="flex space-x-1">
              <Button
                variant={headerInputMode === 'key-value' ? 'default' : 'outline'}
                size="sm"
                onClick={() => headerInputMode === 'json' ? switchToKeyValue() : null}
              >
                <List className="h-3 w-3 mr-1" />
                Key-Value
              </Button>
              <Button
                variant={headerInputMode === 'json' ? 'default' : 'outline'}
                size="sm"
                onClick={() => headerInputMode === 'key-value' ? switchToJson() : null}
              >
                <Code className="h-3 w-3 mr-1" />
                JSON
              </Button>
            </div>
          </div>

          {headerInputMode === 'key-value' ? (
            <div className="space-y-2">
              {headers.map((header, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={header.enabled}
                    onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Input
                    placeholder="Header Key"
                    value={header.key}
                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                    className="flex-1 font-mono text-sm"
                  />
                  <Input
                    placeholder="Header Value"
                    value={header.value}
                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHeader(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addHeader}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Header
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Textarea
                value={jsonHeaders}
                onChange={(e) => setJsonHeaders(e.target.value)}
                placeholder='{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer token"\n}'
                className="font-mono text-sm min-h-[150px]"
              />
              <p className="text-xs text-muted-foreground">
                Enter headers as a JSON object
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}