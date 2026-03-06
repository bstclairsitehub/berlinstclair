import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-24 text-center">
      <div className="border-t-4 border-double border-dp-border pt-12 max-w-xl mx-auto">
        <p className="font-sans text-xs uppercase tracking-widest text-dp-red font-semibold mb-4">
          404 — Page Not Found
        </p>
        <h1 className="font-headline text-6xl text-dp-text mb-6 leading-none">
          This Story Has Been Archived
        </h1>
        <p className="font-body text-xl italic text-dp-text-secondary mb-8 leading-relaxed">
          The page you are looking for may have been moved, deleted, or never existed.
          Our editors regret the inconvenience.
        </p>
        <Link
          href="/"
          className="inline-block font-sans text-sm uppercase tracking-widest bg-dp-gold text-dp-bg px-8 py-3 hover:bg-dp-gold/90 transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  )
}
