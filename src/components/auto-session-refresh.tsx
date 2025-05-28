'use client'

import { useSession } from 'next-auth/react'
import { useIdleTimer } from 'react-idle-timer'
import { useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface AutoSessionRefreshProps {
  children: React.ReactNode
  idleTimeout?: number // Time before showing warning (in ms)
  warningDuration?: number // Time to show warning before logout (in ms)
  refreshInterval?: number // Interval to check and refresh session (in ms)
}

export function AutoSessionRefresh({
  children,
  idleTimeout = Number(process.env.NEXT_PUBLIC_IDLE_TIMEOUT) || 50 * 60 * 1000, // 50 minutes default
  warningDuration = Number(process.env.NEXT_PUBLIC_WARNING_DURATION) || 5 * 60 * 1000, // 5 minute warning default
  refreshInterval = Number(process.env.NEXT_PUBLIC_REFRESH_INTERVAL) || 10 * 60 * 1000, // Check every 10 minutes default
}: AutoSessionRefreshProps) {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [showWarning, setShowWarning] = useState(false)
  const [countdown, setCountdown] = useState(warningDuration / 1000)

  // Refresh session function
  const refreshSession = useCallback(async () => {
    if (session && !session.error) {
      try {
        await update()
        console.log('Session refreshed successfully')
      } catch (error) {
        console.error('Failed to refresh session:', error)
      }
    }
  }, [session, update])

  // Handle user activity
  const handleUserActivity = useCallback(() => {
    setShowWarning(false)
    setCountdown(warningDuration / 1000)
    refreshSession()
  }, [refreshSession, warningDuration])

  // Handle idle timeout
  const handleIdleTimeout = useCallback(() => {
    if (session && !session.error) {
      setShowWarning(true)
    }
  }, [session])

  // Setup idle timer
  const { getRemainingTime, getLastActiveTime, isIdle, reset } = useIdleTimer({
    timeout: idleTimeout,
    onIdle: handleIdleTimeout,
    debounce: 500,
    eventsThrottle: 500,
    events: [
      'mousedown',
      'mousemove',
      'keypress',
      'keydown',
      'touchstart',
      'touchmove',
      'wheel',
      'DOMMouseScroll',
      'MSPointerDown',
      'MSPointerMove'
    ]
  })

  // Handle visibility change - reset idle timer when tab becomes visible
  const handleVisibilityChange = useCallback(() => {
    if (!document.hidden && !showWarning) {
      // Tab became visible and no warning is shown, reset the idle timer
      reset()
    }
  }, [showWarning, reset])

  // Periodic session refresh
  useEffect(() => {
    if (status !== 'authenticated') return

    const interval = setInterval(() => {
      if (!isIdle() && session && !session.error) {
        refreshSession()
      }
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [status, session, refreshSession, refreshInterval, isIdle])

  // Countdown timer for warning dialog
  useEffect(() => {
    if (!showWarning) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Session expired, logout and redirect to Keycloak
          window.location.href = '/api/logout'
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showWarning, router])

  // Handle session errors
  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError' || session?.error === 'NoRefreshToken') {
      // Token refresh failed, logout and redirect to Keycloak
      window.location.href = '/api/logout'
    }
  }, [session?.error, router])

  // Listen for visibility changes
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [handleVisibilityChange])

  return (
    <>
      {children}
      <Dialog open={showWarning} onOpenChange={() => {}}>
        <DialogContent className="session-warning-dialog w-[90vw] max-w-[320px] sm:max-w-[425px] md:max-w-[500px] p-4 sm:p-6" hideCloseButton>
          <DialogHeader className="session-warning-header space-y-3 sm:space-y-4">
            <DialogTitle className="session-warning-title text-base sm:text-lg md:text-xl font-semibold text-center sm:text-left">
              Session Expiring Soon
            </DialogTitle>
            <DialogDescription className="session-warning-description text-sm sm:text-base text-center sm:text-left leading-relaxed">
              Your session will expire in{' '}
              <span className="session-warning-countdown font-bold text-primary text-base sm:text-lg">
                {countdown}
              </span>{' '}
              seconds due to inactivity.
              <span className="block mt-1 sm:mt-2">Click continue to stay logged in.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="session-warning-footer flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowWarning(false)
                window.location.href = '/api/logout'
              }}
              className="session-warning-logout-button w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
            >
              Logout
            </Button>
            <Button 
              onClick={handleUserActivity} 
              className="session-warning-continue-button w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base shadow-lg shadow-primary/20"
            >
              Continue Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}