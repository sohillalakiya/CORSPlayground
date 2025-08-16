import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  let method: string | undefined
  let url: string | undefined
  
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    method = body.method
    url = body.url
    const { headers, body: requestBody } = body

    // Validate input
    if (!method || !url) {
      return NextResponse.json(
        { error: 'Method and URL are required' },
        { status: 400 }
      )
    }

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: {
        ...headers,
        // Remove host header to avoid conflicts
        host: undefined,
      },
    }

    // Add body for POST, PUT, PATCH requests
    if (requestBody && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      const contentType = headers['Content-Type'] || headers['content-type']
      
      if (contentType?.includes('multipart/form-data')) {
        // For form-data, create FormData object
        const formData = new FormData()
        Object.entries(requestBody as Record<string, string | Blob>).forEach(([key, value]) => {
          formData.append(key, value)
        })
        fetchOptions.body = formData
        // Remove Content-Type header to let browser set it with boundary
        if (fetchOptions.headers && typeof fetchOptions.headers === 'object') {
          const headers = fetchOptions.headers as Record<string, string>
          delete headers['Content-Type']
          delete headers['content-type']
        }
      } else if (typeof requestBody === 'object') {
        fetchOptions.body = JSON.stringify(requestBody)
        if (!contentType) {
          fetchOptions.headers = {
            ...fetchOptions.headers,
            'Content-Type': 'application/json',
          }
        }
      } else {
        fetchOptions.body = requestBody
      }
    }

    // Make the actual request
    const response = await fetch(url, fetchOptions)

    // Get response data
    let responseData: unknown
    const contentType = response.headers.get('content-type') || ''

    try {
      if (contentType.includes('application/json')) {
        responseData = await response.json()
      } else if (contentType.includes('text/')) {
        responseData = await response.text()
      } else {
        // For binary data, convert to base64
        const buffer = await response.arrayBuffer()
        responseData = Buffer.from(buffer).toString('base64')
      }
    } catch {
      responseData = await response.text()
    }

    // Build response headers
    const responseHeaders: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      // Skip some headers that shouldn't be forwarded
      if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        responseHeaders[key] = value
      }
    })

    // Return the response
    return NextResponse.json(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    })
  } catch (error) {
    console.error('Proxy error:', error)
    console.error('Failed URL:', url)
    console.error('Method:', method)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? {
          url,
          method,
          errorStack: error instanceof Error ? error.stack : undefined
        } : undefined
      },
      { status: 500 }
    )
  }
}