import { 
  OilResourceCreate, 
  OilResourceResponse, 
  OilResourceUpdate, 
  CursorPage,
  UploadUrlRequest,
  UploadUrlResponse 
} from '@/types/oil'

// Public API URL for unauthenticated requests
const PUBLIC_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`

// Proxy URL for authenticated requests
const PROXY_API_URL = '/api/proxy'

async function fetchPublic(url: string, options: RequestInit = {}) {
  const response = await fetch(`${PUBLIC_API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Since we're using a proxy, we don't need to handle tokens client-side
  const response = await fetch(`${PROXY_API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for session
  })

  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - logout and redirect to Keycloak
      if (typeof window !== 'undefined') {
        window.location.href = '/api/logout'
      }
      throw new Error('Session expired')
    }
    
    if (response.status === 503) {
      throw new Error('Backend service unavailable')
    }
    
    // Try to get error message from response
    try {
      const error = await response.json()
      throw new Error(error.error || `API error: ${response.statusText}`)
    } catch {
      throw new Error(`API error: ${response.statusText}`)
    }
  }

  return response.status === 204 ? null : response.json()
}

// Helper function to map backend cursor fields to frontend expected fields
function mapCursorPage<T>(data: any): CursorPage<T> {
  return {
    items: data.items,
    next_cursor: data.next_cursor || data.next_page || null,
    previous_cursor: data.previous_cursor || data.previous_page || null,
    next_page: data.next_page,
    previous_page: data.previous_page
  }
}

export const api = {
  oils: {
    // Authenticated endpoints
    list: async (cursor?: string): Promise<CursorPage<OilResourceResponse>> => {
      const data = await fetchWithAuth(`/oil/${cursor ? `?cursor=${cursor}` : ''}`)
      return mapCursorPage<OilResourceResponse>(data)
    },
    
    get: (id: string): Promise<OilResourceResponse> => 
      fetchWithAuth(`/oil/${id}`),
    
    create: (data: OilResourceCreate): Promise<OilResourceResponse> => 
      fetchWithAuth('/oil/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: OilResourceUpdate): Promise<OilResourceResponse> => 
      fetchWithAuth(`/oil/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string): Promise<void> => 
      fetchWithAuth(`/oil/${id}`, {
        method: 'DELETE',
      }),
    
    generateUploadUrl: (data: UploadUrlRequest): Promise<UploadUrlResponse> => 
      fetchWithAuth('/oil/upload-url', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
}

export const apiPublic = {
  oils: {
    // Public endpoints (no authentication required)
    list: async (cursor?: string): Promise<CursorPage<OilResourceResponse>> => {
      const data = await fetchPublic(`/oil/${cursor ? `?cursor=${cursor}` : ''}`)
      return mapCursorPage<OilResourceResponse>(data)
    },
  },
}