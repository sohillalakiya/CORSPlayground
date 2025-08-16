'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Code } from 'lucide-react'
import { toast } from 'sonner'

export type BodyType = 'none' | 'json' | 'form-data' | 'raw'

export interface FormDataItem {
  key: string
  value: string
  type: 'text' | 'file'
  enabled: boolean
}

export interface RequestBodyProps {
  bodyType: BodyType
  setBodyType: (type: BodyType) => void
  jsonBody: string
  setJsonBody: (body: string) => void
  formData: FormDataItem[]
  setFormData: (data: FormDataItem[]) => void
  rawBody: string
  setRawBody: (body: string) => void
  rawContentType: string
  setRawContentType: (type: string) => void
}

export function RequestBody({
  bodyType,
  setBodyType,
  jsonBody,
  setJsonBody,
  formData,
  setFormData,
  rawBody,
  setRawBody,
  rawContentType,
  setRawContentType
}: RequestBodyProps) {
  const [jsonError, setJsonError] = useState<string | null>(null)

  // Validate JSON when it changes
  useEffect(() => {
    if (bodyType === 'json' && jsonBody) {
      try {
        JSON.parse(jsonBody)
        setJsonError(null)
      } catch {
        setJsonError('Invalid JSON format')
      }
    }
  }, [jsonBody, bodyType])

  const addFormDataItem = () => {
    setFormData([...formData, { key: '', value: '', type: 'text', enabled: true }])
  }

  const updateFormDataItem = (index: number, field: keyof FormDataItem, value: string | boolean) => {
    const newFormData = [...formData]
    newFormData[index] = { ...newFormData[index], [field]: value }
    setFormData(newFormData)
  }

  const removeFormDataItem = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index))
  }

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonBody)
      setJsonBody(JSON.stringify(parsed, null, 2))
      toast.success('JSON formatted')
    } catch {
      toast.error('Invalid JSON - cannot format')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Body</CardTitle>
        <CardDescription>
          Configure the request body to send with your API request
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={bodyType} onValueChange={(value) => setBodyType(value as BodyType)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="none">None</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="form-data">Form Data</TabsTrigger>
            <TabsTrigger value="raw">Raw</TabsTrigger>
          </TabsList>

          <TabsContent value="none" className="mt-4">
            <div className="text-sm text-muted-foreground text-center py-8">
              No request body will be sent
            </div>
          </TabsContent>

          <TabsContent value="json" className="mt-4 space-y-2">
            <div className="flex justify-between items-center mb-2">
              <Label>JSON Content</Label>
              <Button size="sm" variant="outline" onClick={formatJson}>
                <Code className="h-3 w-3 mr-1" />
                Format
              </Button>
            </div>
            <Textarea
              value={jsonBody}
              onChange={(e) => setJsonBody(e.target.value)}
              placeholder={'{\n  "key": "value",\n  "number": 123,\n  "array": [1, 2, 3]\n}'}
              className="font-mono text-sm min-h-[200px]"
            />
            {jsonError && (
              <p className="text-sm text-red-500">{jsonError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Content-Type: application/json will be automatically added
            </p>
          </TabsContent>

          <TabsContent value="form-data" className="mt-4 space-y-2">
            <Label>Form Data Fields</Label>
            <div className="space-y-2">
              {formData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={(e) => updateFormDataItem(index, 'enabled', e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Input
                    placeholder="Key"
                    value={item.key}
                    onChange={(e) => updateFormDataItem(index, 'key', e.target.value)}
                    className="flex-1 font-mono text-sm"
                  />
                  <Select
                    value={item.type}
                    onValueChange={(value) => updateFormDataItem(index, 'type', value)}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="file">File</SelectItem>
                    </SelectContent>
                  </Select>
                  {item.type === 'text' ? (
                    <Input
                      placeholder="Value"
                      value={item.value}
                      onChange={(e) => updateFormDataItem(index, 'value', e.target.value)}
                      className="flex-1 font-mono text-sm"
                    />
                  ) : (
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          updateFormDataItem(index, 'value', file.name)
                        }
                      }}
                      className="flex-1"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFormDataItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addFormDataItem}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Content-Type: multipart/form-data will be automatically added
            </p>
          </TabsContent>

          <TabsContent value="raw" className="mt-4 space-y-2">
            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select value={rawContentType} onValueChange={setRawContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text/plain">Text (text/plain)</SelectItem>
                  <SelectItem value="text/html">HTML (text/html)</SelectItem>
                  <SelectItem value="text/xml">XML (text/xml)</SelectItem>
                  <SelectItem value="application/xml">XML (application/xml)</SelectItem>
                  <SelectItem value="application/x-www-form-urlencoded">
                    URL Encoded (application/x-www-form-urlencoded)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Raw Content</Label>
              <Textarea
                value={rawBody}
                onChange={(e) => setRawBody(e.target.value)}
                placeholder="Enter raw body content..."
                className="font-mono text-sm min-h-[200px]"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}