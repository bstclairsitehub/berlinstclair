import type { Metadata } from 'next'
import { signIn } from '@/lib/auth'

export const metadata: Metadata = { title: 'Sign In | The Daily Gay CMS' }

// Note: do NOT call auth() here — it causes an Auth.js v5 redirect loop on the signIn page.
// Already-authenticated users are handled by the middleware (redirected from /admin to /admin).
export default async function LoginPage() {
  return (
    <div className="min-h-screen bg-dp-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Top gold rule */}
        <div className="h-1 bg-dp-gold mb-8" />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-masthead text-5xl text-dp-text leading-none mb-2">
            The Daily Gay
          </h1>
          <p className="font-sans text-xs uppercase tracking-widest text-dp-text-secondary">
            Editorial Dashboard
          </p>
        </div>

        <div className="bg-dp-elevated border border-dp-border p-8">
          <h2 className="font-headline text-2xl text-dp-text mb-6 text-center">
            Sign In
          </h2>

          {/* GitHub OAuth */}
          <form
            action={async () => {
              'use server'
              await signIn('github', { redirectTo: '/admin' })
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-dp-gold text-dp-bg font-sans text-sm uppercase tracking-widest py-3 hover:bg-dp-gold/90 transition-colors"
            >
              {/* GitHub icon */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              Continue with GitHub
            </button>
          </form>

          <p className="font-sans text-xs text-dp-text-secondary text-center mt-4">
            Access is restricted to authorized staff only.
          </p>
        </div>

        {/* Bottom note */}
        <p className="text-center mt-6">
          <a
            href="/"
            className="font-sans text-xs text-dp-text-secondary hover:text-dp-text transition-colors uppercase tracking-widest"
          >
            ← Return to site
          </a>
        </p>
      </div>
    </div>
  )
}
