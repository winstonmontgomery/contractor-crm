import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Admin routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/leads',
  '/admin',
  '/users',
  '/settings',
  '/prospects',
  '/projects',
  '/verification',
  '/my-verification',
]

// Admin password - in production, use environment variable
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'CVAdmin2026!'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if this is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  )
  
  if (!isProtectedRoute) {
    return NextResponse.next()
  }
  
  // Check for auth cookie
  const authCookie = request.cookies.get('cv_admin_auth')
  
  if (authCookie?.value === 'authenticated') {
    return NextResponse.next()
  }
  
  // Redirect to login
  const loginUrl = new URL('/admin-login', request.url)
  loginUrl.searchParams.set('redirect', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/leads/:path*',
    '/admin/:path*',
    '/users/:path*',
    '/settings/:path*',
    '/prospects/:path*',
    '/projects/:path*',
    '/verification/:path*',
    '/my-verification/:path*',
  ],
}
