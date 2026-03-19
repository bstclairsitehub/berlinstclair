import Image from 'next/image'

/**
 * Author signature sign-off displayed at the bottom of every article.
 * Uses the white-on-transparent version for the dark theme.
 */
export default function AuthorSignature() {
  return (
    <div className="mt-16 mb-8 border-t border-dp-border pt-10">
      {/* Decorative rule */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex-1 border-t border-dp-border" />
        <div className="mx-4 w-1.5 h-1.5 rounded-full bg-dp-gold" />
        <div className="flex-1 border-t border-dp-border" />
      </div>

      {/* Signature image */}
      <div className="flex justify-center">
        <Image
          src="/images/signature-white.png"
          alt="Berlin Madox St. Clair"
          width={320}
          height={100}
          className="opacity-90 select-none pointer-events-none"
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* Subtle byline */}
      <p className="text-center font-sans text-xs uppercase tracking-[0.3em] text-dp-text-muted mt-4">
        Berlin Madox St. Clair
      </p>
    </div>
  )
}
