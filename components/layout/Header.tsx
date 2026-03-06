import Link from 'next/link';
import { auth, signOut } from '@/lib/auth';

export default async function Header() {
  let session = null;
  try {
    session = await auth();
  } catch {
    // DB unreachable — render as logged-out
  }

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="w-full">
      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-dp-gold via-dp-blue to-dp-red" />

      {/* Masthead area */}
      <div className="border-b border-dp-border-light bg-dp-bg">
        {/* Top utility bar */}
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Date - left */}
          <div className="hidden sm:block font-sans text-xs text-dp-text-muted tracking-widest uppercase">
            {formattedDate}
          </div>
          <div className="block sm:hidden font-sans text-xs text-dp-text-muted tracking-widest uppercase">
            {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>

          {/* Publication name - center */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="block">
              <h1 className="font-masthead text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-dp-text leading-none tracking-normal hover:opacity-80 transition-opacity">
                The Daily Gay
              </h1>
            </Link>
          </div>

          {/* Right side - auth / subscribe */}
          <div className="flex items-center gap-3 font-sans text-xs">
            {session?.user ? (
              <div className="flex items-center gap-3">
                <span className="hidden md:block text-dp-text-secondary tracking-widest uppercase text-xs">
                  {session.user.name ?? session.user.email}
                </span>
                <Link
                  href="/admin"
                  className="hidden sm:inline-block uppercase tracking-widest text-xs font-semibold text-dp-text hover:text-dp-blue transition-colors border border-dp-border px-3 py-1.5 hover:border-dp-blue"
                >
                  Dashboard
                </Link>
                <form
                  action={async () => {
                    'use server';
                    await signOut({ redirectTo: '/' });
                  }}
                >
                  <button
                    type="submit"
                    className="uppercase tracking-widest text-xs font-semibold text-dp-text-muted hover:text-dp-red transition-colors"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/login"
                  className="uppercase tracking-widest text-xs font-semibold text-dp-text-secondary hover:text-dp-text transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/subscribe"
                  className="uppercase tracking-widest text-xs font-semibold bg-dp-gold text-dp-bg px-4 py-1.5 hover:bg-dp-gold/90 transition-colors rounded-sm"
                >
                  Subscribe
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Spacer for centered title on small screens */}
        <div className="h-2 sm:hidden" />
      </div>
    </header>
  );
}
