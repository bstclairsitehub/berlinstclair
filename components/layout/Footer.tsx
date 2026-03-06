import Link from 'next/link';

const footerLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Advertise', href: '/advertise' },
  { label: 'Careers', href: '/careers' },
];

const sectionLinks = [
  { label: 'Gay Storytime', href: '/section/gay-storytime' },
  { label: 'Fashion', href: '/section/fashion' },
  { label: 'Music I\'m Listening To', href: '/section/music' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-dp-surface border-t border-dp-border-light">
      <div className="max-w-screen-xl mx-auto px-4 py-12 md:py-16">
        {/* Top section */}
        <div className="text-center border-b border-dp-border pb-10 mb-10">
          {/* Decorative line */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex-1 border-t border-dp-border" />
            <div className="mx-3 w-2 h-2 rounded-full bg-dp-gold" />
            <div className="flex-1 border-t border-dp-border" />
          </div>

          {/* Publication name */}
          <Link href="/" className="inline-block">
            <span className="font-masthead text-3xl md:text-4xl text-dp-text hover:opacity-80 transition-opacity">
              The Daily Gay
            </span>
          </Link>
          <p className="font-body text-sm text-dp-text-muted leading-relaxed mt-4 max-w-xl mx-auto">
            A celebration of queer joy, pride, and the fabulous everyday.
            Committed to authentic stories that inform and inspire.
          </p>
        </div>

        {/* Section navigation grid */}
        <div className="border-b border-dp-border pb-10 mb-10">
          <h3 className="font-sans text-xs uppercase tracking-widest font-semibold text-dp-text-muted mb-6">
            Explore
          </h3>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {sectionLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-body text-sm text-dp-text hover:text-dp-blue transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Copyright */}
          <p className="font-sans text-xs text-dp-text-muted">
            &copy; {currentYear} The Daily Gay. All rights reserved. Located online at{' '}
            <span className="font-semibold text-dp-gold">berlinstclair.com</span>
          </p>

          {/* Footer links */}
          <nav>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {footerLinks.map((link, index) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-xs text-dp-text-muted hover:text-dp-text transition-colors uppercase tracking-wide"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom accent line */}
        <div className="mt-10 pt-6 border-t border-dp-border">
          <div className="h-1 w-24 bg-gradient-to-r from-dp-gold to-dp-red mx-auto" />
        </div>
      </div>
    </footer>
  );
}
