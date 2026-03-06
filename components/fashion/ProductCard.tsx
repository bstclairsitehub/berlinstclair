'use client'

import Image from 'next/image'

export interface Product {
  name: string
  brand: string
  price: string
  image: string
  shopUrl: string
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={product.shopUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-dp-surface border border-dp-border hover:border-dp-gold transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-dp-elevated">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dp-bg/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-block font-sans text-xs uppercase tracking-widest bg-dp-gold text-dp-bg px-3 py-1.5">
            Shop Now
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 space-y-1">
        <p className="font-sans text-xs uppercase tracking-widest text-dp-gold-dim">
          {product.brand}
        </p>
        <p className="font-headline text-sm text-dp-text group-hover:text-dp-gold transition-colors">
          {product.name}
        </p>
        <p className="font-sans text-sm text-dp-text-secondary">
          {product.price}
        </p>
      </div>
    </a>
  )
}
