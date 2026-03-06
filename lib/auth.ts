import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GitHub from 'next-auth/providers/github'
import { prisma } from '@/lib/db'
import type { Role } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: Role
    }
  }
  interface User {
    role: Role
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: 'jwt' },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user
      const pathname = nextUrl.pathname

      // Always allow the login page
      if (pathname === '/admin/login') return true

      // All other /admin/* routes require auth
      if (pathname.startsWith('/admin')) {
        if (!isLoggedIn) return false
        const role = (session as any)?.user?.role
        if (role !== 'ADMIN' && role !== 'EDITOR') {
          return Response.redirect(new URL('/', nextUrl))
        }
        return true
      }

      return true
    },
    async jwt({ token, user }) {
      // On initial sign-in, `user` is the DB user from the adapter
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as Role
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
})
