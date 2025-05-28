import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

export function useErrorHandler() {
  const router = useRouter()

  const handleError = useCallback((error: unknown) => {
    console.error('Error occurred:', error)

    if (error instanceof Error) {
      // Handle session/auth errors
      if (
        error.message.includes('Session expired') ||
        error.message.includes('No authentication token') ||
        error.message.includes('Unauthorized') ||
        error.message.includes('Session error')
      ) {
        // Logout and redirect to Keycloak
        if (typeof window !== 'undefined') {
          window.location.href = '/api/logout'
        }
        return
      }

      // Handle other API errors
      if (error.message.includes('API error')) {
        // You can show a toast notification here
        console.error('API Error:', error.message)
      }
    }

    // For other errors, you might want to show a generic error message
    console.error('An unexpected error occurred')
  }, [router])

  return { handleError }
}