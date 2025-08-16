'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GetRequestPanel } from './get-request-panel'
import { PostRequestPanel } from './post-request-panel'
import { PutRequestPanel } from './put-request-panel'
import { DeleteRequestPanel } from './delete-request-panel'
import { RequestHeader } from './request-config'

export function MethodTabs() {
  const [activeMethod, setActiveMethod] = useState('GET')
  
  // Shared state for URL and headers across all tabs
  const [sharedUrl, setSharedUrl] = useState('')
  const [sharedHeaders, setSharedHeaders] = useState<RequestHeader[]>([
    { key: 'Accept', value: 'application/json', enabled: true }
  ])

  return (
    <Tabs value={activeMethod} onValueChange={setActiveMethod} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="GET" className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400">
          GET
        </TabsTrigger>
        <TabsTrigger value="POST" className="data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
          POST
        </TabsTrigger>
        <TabsTrigger value="PUT" className="data-[state=active]:bg-yellow-500/10 data-[state=active]:text-yellow-600 dark:data-[state=active]:text-yellow-400">
          PUT
        </TabsTrigger>
        <TabsTrigger value="DELETE" className="data-[state=active]:bg-red-500/10 data-[state=active]:text-red-600 dark:data-[state=active]:text-red-400">
          DELETE
        </TabsTrigger>
      </TabsList>

      <TabsContent value="GET" className="mt-6">
        <GetRequestPanel 
          url={sharedUrl}
          setUrl={setSharedUrl}
          headers={sharedHeaders}
          setHeaders={setSharedHeaders}
        />
      </TabsContent>

      <TabsContent value="POST" className="mt-6">
        <PostRequestPanel 
          url={sharedUrl}
          setUrl={setSharedUrl}
          headers={sharedHeaders}
          setHeaders={setSharedHeaders}
        />
      </TabsContent>

      <TabsContent value="PUT" className="mt-6">
        <PutRequestPanel 
          url={sharedUrl}
          setUrl={setSharedUrl}
          headers={sharedHeaders}
          setHeaders={setSharedHeaders}
        />
      </TabsContent>

      <TabsContent value="DELETE" className="mt-6">
        <DeleteRequestPanel 
          url={sharedUrl}
          setUrl={setSharedUrl}
          headers={sharedHeaders}
          setHeaders={setSharedHeaders}
        />
      </TabsContent>
    </Tabs>
  )
}