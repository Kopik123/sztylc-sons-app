import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes
  if (pathname.startsWith('/auth')) {
    return NextResponse.next()
  }

  // Protected routes - check authentication
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token && !pathname.startsWith('/auth')) {
    const signInUrl = new URL('/auth/signin', request.url)
    return NextResponse.redirect(signInUrl)
  }

  // Role-based access control for dashboard routes
  if (pathname.startsWith('/dashboard/')) {
    const role = token?.role as string

    if (pathname.startsWith('/dashboard/client') && role !== 'CLIENT') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (pathname.startsWith('/dashboard/worker') && role !== 'WORKER') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (pathname.startsWith('/dashboard/manager') && role !== 'MANAGER') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Security headers
  const response = NextResponse.next()
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  )

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
