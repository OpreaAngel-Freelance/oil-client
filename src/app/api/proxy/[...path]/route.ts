import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, { params }, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, { params }, 'POST')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, { params }, 'PUT')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, { params }, 'DELETE')
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, { params }, 'PATCH')
}

async function handleRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
  method: string
) {
  try {
    // Get the session (but don't require it - let backend handle auth)
    const session = await auth()

    // Await params before using
    const resolvedParams = await params
    // Construct the backend URL
    const path = resolvedParams.path.join('/')
    const url = new URL(request.url)
    const backendUrl = `${BACKEND_API_URL}/api/v1/${path}${url.search}`

    // Prepare headers
    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    
    // Include authorization header if session exists
    if (session?.accessToken) {
      headers.set('Authorization', `Bearer ${session.accessToken}`)
    }
    
    // Forward some headers from the original request if needed
    const acceptHeader = request.headers.get('accept')
    if (acceptHeader) {
      headers.set('Accept', acceptHeader)
    }

    // Prepare the request body
    let body = undefined
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        body = await request.json()
      } catch {
        // If not JSON, try to get text
        body = await request.text()
      }
    }

    console.log('Proxy backend request:', {
      url: backendUrl,
      method,
      hasBody: !!body,
      hasAuth: !!headers.get('Authorization')
    })

    // Make the request to the backend
    const response = await fetch(backendUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    console.log('Backend response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })

    // Get the response data
    let data
    const contentType = response.headers.get('content-type')
    
    // Handle 204 No Content response
    if (response.status === 204) {
      data = null
    } else {
      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }
    }

    // Log backend error details for debugging
    if (response.status === 401) {
      console.log('Backend 401 error details:', data)
    }

    // Return the response
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 })
    }
    
    return NextResponse.json(
      data,
      { 
        status: response.status,
        headers: {
          'Content-Type': contentType || 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Proxy error:', error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        return NextResponse.json(
          { error: 'Backend service unavailable' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}