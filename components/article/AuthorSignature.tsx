/**
 * Author signature sign-off displayed at the bottom of every article.
 * Uses an elegant cursive font style for the signature.
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

      {/* Signature text */}
      <div className="flex justify-center mb-4">
        <p className="text-center font-serif text-2xl italic opacity-80 select-none pointer-events-none text-dp-text-muted">
          Berlin St. Clair
        </p>
      </div>

      {/* Subtle byline */}
      <p className="text-center font-sans text-xs uppercase tracking-[0.3em] text-dp-text-muted">
        Berlin Madox St. Clair
      </p>
    </div>
  )
}
