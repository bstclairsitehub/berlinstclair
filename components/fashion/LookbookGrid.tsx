import ProductCard from './ProductCard'
import type { Product } from './ProductCard'

// Sample lookbook items — in production, these would come from a CMS field or API
const SAMPLE_PRODUCTS: Product[] = [
  {
    name: 'Oversized Linen Blazer',
    brand: 'COS',
    price: '$175',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
    shopUrl: '#',
  },
  {
    name: 'Wide-Leg Pleated Trousers',
    brand: 'Arket',
    price: '$89',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
    shopUrl: '#',
  },
  {
    name: 'Minimal Leather Tote',
    brand: 'Everlane',
    price: '$198',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    shopUrl: '#',
  },
  {
    name: 'Cotton Crew Neck Tee',
    brand: 'Uniqlo U',
    price: '$15',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    shopUrl: '#',
  },
]

export default function LookbookGrid({ products }: { products?: Product[] }) {
  const items = products ?? SAMPLE_PRODUCTS

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-xs uppercase tracking-widest text-dp-gold font-semibold">
          Shop the Look
        </h2>
        <div className="h-px flex-1 ml-4 bg-dp-border" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((product, i) => (
          <ProductCard key={i} product={product} />
        ))}
      </div>
    </div>
  )
}
