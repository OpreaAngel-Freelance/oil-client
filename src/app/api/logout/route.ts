import { NextResponse } from 'next/server'
import { auth, signOut } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  
  if (session?.idToken) {
    // Clear NextAuth session
    await signOut({ redirect: false })
    
    // Redirect to Keycloak logout
    const keycloakLogoutUrl = new URL(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`)
    keycloakLogoutUrl.searchParams.set('id_token_hint', session.idToken)
    keycloakLogoutUrl.searchParams.set('post_logout_redirect_uri', process.env.NEXTAUTH_URL || 'http://localhost:3000')
    
    return NextResponse.redirect(keycloakLogoutUrl)
  }
  
  // Fallback to regular signout
  await signOut({ redirect: false })
  return NextResponse.redirect(new URL('/', process.env.NEXTAUTH_URL || 'http://localhost:3000'))
}