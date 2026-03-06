import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Always allow the login page
  if (pathname === '/admin/login') return NextResponse.next()

  const session = req.auth

  if (!session?.user) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  const role = (session.user as any).role
  if (role !== 'ADMIN' && role !== 'EDITOR') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*'],
}
