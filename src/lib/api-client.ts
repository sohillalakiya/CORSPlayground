export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  headers?: Record<string, string>
  body?: unknown
}

export interface ApiResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  data: unknown
  responseTime: number
  contentLength: number
  contentType: string
}

export class ApiError extends Error {
  public statusCode?: number
  public response?: unknown

  constructor(message: string, statusCode?: number, response?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.response = response
  }
}

export class ApiClient {
  private baseUrl: string
  private useProxy: boolean

  constructor(baseUrl: string = '', useProxy: boolean = true) {
    this.baseUrl = baseUrl
    this.useProxy = useProxy
  }

  private buildUrl(url: string): string {
    // If the URL is already a full URL, use it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    
    // Otherwise, combine with base URL
    if (this.baseUrl) {
      const base = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl
      const path = url.startsWith('/') ? url : `/${url}`
      return `${base}${path}`
    }
    
    // If no base URL and not a full URL, throw error
    throw new ApiError('No base URL configured and URL is not absolute')
  }

  async makeRequest(request: ApiRequest): Promise<ApiResponse> {
    const startTime = Date.now()
    const fullUrl = this.buildUrl(request.url)

    try {
      let response: Response
      
      if (this.useProxy) {
        // Make the API request through our proxy endpoint
        response = await fetch('/api/proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            method: request.method,
            url: fullUrl,
            headers: request.headers || {},
            body: request.body
          })
        })
      } else {
        // Make a direct request to the API (subject to CORS)
        const fetchOptions: RequestInit = {
          method: request.method,
          headers: request.headers || {},
        }
        
        // Add body for POST, PUT, DELETE requests with body
        if (request.body && (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE')) {
          const contentType = request.headers?.['Content-Type'] || request.headers?.['content-type']
          
          if (contentType?.includes('multipart/form-data')) {
            const formData = new FormData()
            Object.entries(request.body as Record<string, string | Blob>).forEach(([key, value]) => {
              formData.append(key, value)
            })
            fetchOptions.body = formData
            // Remove Content-Type header to let browser set it with boundary
            if (fetchOptions.headers) {
              delete (fetchOptions.headers as Record<string, string>)['Content-Type']
              delete (fetchOptions.headers as Record<string, string>)['content-type']
            }
          } else if (typeof request.body === 'object') {
            fetchOptions.body = JSON.stringify(request.body)
            if (!contentType) {
              fetchOptions.headers = {
                ...fetchOptions.headers,
                'Content-Type': 'application/json',
              }
            }
          } else {
            fetchOptions.body = request.body as BodyInit
          }
        }
        
        response = await fetch(fullUrl, fetchOptions)
      }

      const responseTime = Date.now() - startTime
      
      // Get response data
      let data: unknown
      const contentType = response.headers.get('content-type') || ''
      
      try {
        if (contentType.includes('application/json')) {
          data = await response.json()
        } else if (contentType.includes('text/')) {
          data = await response.text()
        } else {
          data = await response.blob()
        }
      } catch {
        data = await response.text()
      }

      // Extract headers
      const headers: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        headers[key] = value
      })

      // If response is not ok, throw error with response data
      if (!response.ok) {
        throw new ApiError(
          `Request failed with status ${response.status}`,
          response.status,
          data
        )
      }

      return {
        status: response.status,
        statusText: response.statusText,
        headers,
        data,
        responseTime,
        contentLength: parseInt(response.headers.get('content-length') || '0'),
        contentType
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error occurred',
        undefined,
        undefined
      )
    }
  }
}