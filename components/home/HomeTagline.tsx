export default function HomeTagline() {
  return (
    <div className="w-full bg-dp-bg border-b border-dp-border">
      <div className="max-w-screen-xl mx-auto px-4 py-6 md:py-8 text-center">
        {/* Decorative double rule */}
        <div className="border-t border-dp-border-light mb-4" />
        <div className="border-t border-dp-border mb-6" />

        <p className="font-body text-sm md:text-base text-dp-text-secondary italic tracking-wide">
          Culture, Style &amp; Stories — A celebration of queer joy, pride, and the fabulous everyday.
        </p>

        {/* Decorative double rule */}
        <div className="border-t border-dp-border mt-6 mb-4" />
        <div className="border-t border-dp-border-light" />
      </div>
    </div>
  )
}
