import NextAuth from "next-auth"
import Keycloak from "next-auth/providers/keycloak"
import { jwtDecode } from 'jwt-decode'

// Types for JWT decoding
interface TokenPayload {
  realm_access?: {
    roles?: string[]
  }
  exp?: number
}

interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
}

// Helper functions
function decodeAccessToken(accessToken: string): {
  roles: string[]
  expiresAt: number
} {
  try {
    const decoded = jwtDecode<TokenPayload>(accessToken)
    return {
      roles: decoded.realm_access?.roles || [],
      expiresAt: decoded.exp || 0
    }
  } catch (error) {
    console.error('Failed to decode access token:', error)
    return {
      roles: [],
      expiresAt: 0
    }
  }
}

async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string
  refreshToken: string
  expiresAt: number
  roles: string[]
}> {
  const response = await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.KEYCLOAK_CLIENT_ID!,
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Token refresh failed: ${error.error_description || response.statusText}`)
  }

  const tokens: RefreshTokenResponse = await response.json()
  const { roles, expiresAt } = decodeAccessToken(tokens.access_token)

  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Math.floor(Date.now() / 1000 + tokens.expires_in),
    roles
  }
}

declare module "next-auth" {
  interface Session {
    accessToken?: string
    idToken?: string
    roles?: string[]
    error?: string
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string
    idToken?: string
    refreshToken?: string
    expiresAt?: number
    roles?: string[]
    error?: string
    provider?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // In production, this should be removed or set conditionally
  trustHost: process.env.NODE_ENV === 'development',
  providers: [
    Keycloak({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.idToken = account.id_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
        token.provider = account.provider
        
        if (account.access_token) {
          try {
            const { roles } = decodeAccessToken(account.access_token)
            token.roles = roles
          } catch (error) {
            console.error('Failed to decode access token during login:', error)
            token.roles = []
          }
        }
      }

      // Check if token is still valid
      if (Date.now() < (token.expiresAt ?? 0) * 1000) {
        return token
      }

      // Token expired, attempt refresh
      if (!token.refreshToken) {
        console.error('No refresh token available')
        return { ...token, error: 'NoRefreshToken' }
      }

      try {
        const refreshedTokens = await refreshAccessToken(token.refreshToken)
        
        return {
          ...token,
          accessToken: refreshedTokens.accessToken,
          refreshToken: refreshedTokens.refreshToken,
          expiresAt: refreshedTokens.expiresAt,
          roles: refreshedTokens.roles,
          error: undefined
        }
      } catch (error) {
        console.error('Error refreshing access token:', error)
        return { 
          ...token, 
          error: error instanceof Error ? error.message : 'RefreshAccessTokenError' 
        }
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.idToken = token.idToken
      session.roles = token.roles
      session.error = token.error
      return session
    },
  },
  // Remove custom pages to use default Keycloak sign-in
})