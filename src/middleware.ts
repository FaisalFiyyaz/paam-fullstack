/**
 * Next.js middleware for authentication and CORS
 * @fileoverview Handles authentication routing and CORS headers
 */

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

/**
 * Route matchers for protected and public routes
 */
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/ai-chat(.*)',
])

const isPublicRoute = createRouteMatcher([
  '/',
  '/api/health',
  '/api/webhooks/clerk',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

/**
 * Clerk authentication middleware configuration
 * @description Protects routes and handles authentication flow
 */
export default clerkMiddleware((auth, req) => {
  // Add CORS headers for API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next()
    
    // CORS configuration
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
    const origin = req.headers.get('origin')
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers })
    }
    
    return response
  }

  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    auth().protect()
  }

  // Redirect authenticated users away from auth pages
  if (auth().userId && req.nextUrl.pathname.startsWith('/sign-')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  
  // Redirect unauthenticated users to sign-in for protected routes
  if (!auth().userId && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }
  
  return NextResponse.next()
})

/**
 * Middleware configuration
 * @description Defines which routes the middleware should run on
 */
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
