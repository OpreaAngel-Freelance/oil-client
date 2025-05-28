import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

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
    // Get the session
    const session = await auth()
    
    // Decode token to check expiration
    let tokenExp = null
    if (session?.accessToken) {
      try {
        const tokenParts = session.accessToken.split('.')
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString())
        tokenExp = payload.exp ? new Date(payload.exp * 1000).toISOString() : null
      } catch (e) {
        console.error('Failed to decode token:', e)
      }
    }

    console.log('Proxy session check:', {
      hasSession: !!session,
      hasAccessToken: !!session?.accessToken,
      sessionError: session?.error,
      path: request.url,
      method,
      sessionKeys: session ? Object.keys(session) : [],
      tokenLength: session?.accessToken ? session.accessToken.length : 0,
      tokenExpiration: tokenExp,
      currentTime: new Date().toISOString()
    })
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - No access token in session' },
        { status: 401 }
      )
    }

    // Check if session has error
    if (session.error) {
      return NextResponse.json(
        { error: 'Session error', details: session.error },
        { status: 401 }
      )
    }

    // Await params before using
    const resolvedParams = await params
    // Construct the backend URL
    const path = resolvedParams.path.join('/')
    const url = new URL(request.url)
    const backendUrl = `${BACKEND_API_URL}/api/v1/${path}${url.search}`

    // Prepare headers
    const headers = new Headers()
    headers.set('Authorization', `Bearer ${session.accessToken}`)
    headers.set('Content-Type', 'application/json')
    
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
      authHeader: headers.get('Authorization')?.substring(0, 20) + '...'
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
      
      // Also log token details for debugging
      if (session?.accessToken) {
        try {
          const tokenParts = session.accessToken.split('.')
          const header = JSON.parse(Buffer.from(tokenParts[0], 'base64').toString())
          const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString())
          console.log('Token details:', {
            header,
            issuer: payload.iss,
            audience: payload.aud,
            subject: payload.sub,
            issuedAt: new Date(payload.iat * 1000).toISOString(),
            expiration: new Date(payload.exp * 1000).toISOString(),
            azp: payload.azp,
            realm_access: payload.realm_access
          })
        } catch (e) {
          console.error('Failed to decode token for debugging:', e)
        }
      }
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