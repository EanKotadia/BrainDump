"use client"

import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Temporarily bypass authentication checks
  return <>{children}</>
}
