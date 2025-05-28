'use client'

import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { ErrorBoundary } from '@/components/error-boundary'
import { AutoSessionRefresh } from '@/components/auto-session-refresh'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  }))

  return (
    <div className="providers-wrapper">
      <ErrorBoundary>
        <div className="session-provider-wrapper">
          <SessionProvider 
            refetchInterval={5 * 60} // Refetch session every 5 minutes
            refetchOnWindowFocus={true} // Refetch when window regains focus
          >
            <div className="query-client-provider-wrapper">
              <QueryClientProvider client={queryClient}>
                <div className="auto-session-refresh-wrapper">
                  <AutoSessionRefresh
                    idleTimeout={55 * 60 * 1000} // Show warning after 55 minutes of inactivity
                    warningDuration={5 * 60 * 1000} // Give 5 minutes warning before logout
                    refreshInterval={10 * 60 * 1000} // Refresh session every 10 minutes when active
                  >
                    <ErrorBoundary>
                      <div className="providers-children-wrapper">
                        {children}
                      </div>
                    </ErrorBoundary>
                  </AutoSessionRefresh>
                </div>
              </QueryClientProvider>
            </div>
          </SessionProvider>
        </div>
      </ErrorBoundary>
    </div>
  )
}