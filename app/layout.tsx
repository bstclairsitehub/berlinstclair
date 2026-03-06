import type { Metadata } from 'next'
import {
  Playfair_Display,
  Merriweather,
  Montserrat,
  UnifrakturMaguntia,
} from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { getCategories } from '@/lib/actions/articles'

/* ------------------------------------------------------------------
   Font definitions — downloaded once at build time, zero runtime
   network requests to Google. CSS variables are injected into <html>.
------------------------------------------------------------------ */
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const merriweather = Merriweather({
  subsets: ['latin'],
  variable: '--font-merriweather',
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const unifraktur = UnifrakturMaguntia({
  subsets: ['latin'],
  variable: '--font-unifraktur',
  weight: ['400'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://berlinstclair.com'),
  title: {
    default: 'The Daily Gay — Culture, Style & Stories',
    template: '%s | The Daily Gay',
  },
  description:
    'A celebration of queer joy, pride, and the fabulous everyday. Explore fashion, music, stories, and authentic culture from the LGBTQ+ community.',
  keywords: ['gay', 'LGBTQ+', 'queer', 'lifestyle', 'fashion', 'music', 'stories', 'culture'],
  openGraph: {
    type: 'website',
    siteName: 'The Daily Gay',
    title: 'The Daily Gay — Culture, Style & Stories',
    description:
      'A celebration of queer joy, pride, and the fabulous everyday.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@thedailygay',
  },
  alternates: {
    canonical: 'https://berlinstclair.com',
  },
  verification: {
    google: 'google-site-verification=YOUR_GOOGLE_VERIFICATION_CODE',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getCategories()

  return (
    <html
      lang="en"
      className={[
        playfair.variable,
        merriweather.variable,
        montserrat.variable,
        unifraktur.variable,
      ].join(' ')}
    >
      <body className="min-h-screen flex flex-col bg-dp-bg text-dp-text">
        <Header />
        <Navigation categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
