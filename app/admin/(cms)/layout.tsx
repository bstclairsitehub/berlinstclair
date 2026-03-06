import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: { default: 'CMS Dashboard', template: '%s | Daily Gay CMS' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session
  try {
    session = await auth()
  } catch {
    redirect('/admin/login')
  }

  // Extra server-side guard (middleware also protects)
  if (!session?.user) redirect('/admin/login')

  const isPrivileged = session.user.role === 'ADMIN' || session.user.role === 'EDITOR'
  if (!isPrivileged) redirect('/')

  return (
    <div className="min-h-screen bg-dp-bg flex flex-col">
      {/* Top gold rule — matches the main site */}
      <div className="h-1 bg-dp-gold w-full" />

      {/* Masthead — newspaper-style */}
      <header className="border-b-2 border-dp-border-light">
        <div className="max-w-screen-xl mx-auto px-4 py-4 text-center">
          <Link href="/admin" className="inline-block">
            <h1 className="font-masthead text-4xl sm:text-5xl text-dp-text hover:opacity-80 transition-opacity">
              The Daily Gay
            </h1>
          </Link>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-dp-text-muted mt-1">
            Editorial Dashboard
          </p>
        </div>
      </header>

      {/* Navigation — same style as public nav */}
      <nav className="border-b border-dp-border">
        <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            <Link
              href="/admin"
              className="font-sans text-xs uppercase tracking-widest text-dp-text-secondary hover:text-dp-text px-3 py-1 transition-colors whitespace-nowrap"
            >
              Dashboard
            </Link>
            <span className="text-dp-border">|</span>
            <Link
              href="/admin/articles"
              className="font-sans text-xs uppercase tracking-widest text-dp-text-secondary hover:text-dp-text px-3 py-1 transition-colors whitespace-nowrap"
            >
              All Posts
            </Link>
            <span className="text-dp-border">|</span>
            <Link
              href="/admin/articles/new?section=gay-storytime"
              className="font-sans text-xs uppercase tracking-widest text-dp-text-secondary hover:text-dp-text px-3 py-1 transition-colors whitespace-nowrap"
            >
              + Storytime
            </Link>
            <span className="text-dp-border">|</span>
            <Link
              href="/admin/articles/new?section=fashion"
              className="font-sans text-xs uppercase tracking-widest text-dp-text-secondary hover:text-dp-text px-3 py-1 transition-colors whitespace-nowrap"
            >
              + Fashion
            </Link>
            <span className="text-dp-border">|</span>
            <Link
              href="/admin/articles/new?section=music"
              className="font-sans text-xs uppercase tracking-widest text-dp-text-secondary hover:text-dp-text px-3 py-1 transition-colors whitespace-nowrap"
            >
              + Music
            </Link>
          </div>

          {/* User info — right side */}
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            <span className="font-sans text-xs text-dp-text-muted hidden md:block">
              {session.user.name ?? session.user.email}
            </span>
            <span className="font-sans text-xs uppercase tracking-widest text-dp-text-secondary border border-dp-border px-2 py-0.5">
              {session.user.role}
            </span>
            <Link
              href="/"
              target="_blank"
              className="font-sans text-xs uppercase tracking-widest text-dp-text-muted hover:text-dp-text transition-colors"
            >
              Site ↗
            </Link>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <div className="flex-1">
        <div className="max-w-screen-xl mx-auto px-4 py-8">{children}</div>
      </div>

      {/* Footer rule — matches main site */}
      <div className="border-t-2 border-double border-dp-border-light mt-auto">
        <div className="max-w-screen-xl mx-auto px-4 py-4 text-center">
          <p className="font-sans text-xs text-dp-text-muted uppercase tracking-widest">
            The Daily Gay — Editorial Dashboard
          </p>
        </div>
      </div>
    </div>
  )
}
