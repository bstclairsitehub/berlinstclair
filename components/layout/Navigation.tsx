import Link from 'next/link';
import type { CategoryWithCount } from '@/lib/types';

interface NavigationProps {
  categories: CategoryWithCount[];
}

export default function Navigation({ categories }: NavigationProps) {
  return (
    <nav className="w-full border-t-2 border-b border-dp-border-light bg-dp-bg sticky top-0 z-40">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Scrollable container on mobile */}
        <div className="overflow-x-auto scrollbar-hide">
          <ul className="flex items-center min-w-max h-11">
            {/* Home link */}
            <li className="flex items-center">
              <Link
                href="/"
                className="font-sans text-xs uppercase tracking-widest font-semibold text-dp-text hover:text-dp-blue transition-colors whitespace-nowrap px-4 py-1 relative group"
              >
                Home
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-dp-gold scale-x-0 group-hover:scale-x-100 transition-transform" />
              </Link>
            </li>

            {/* Divider after Home */}
            {categories.length > 0 && (
              <li className="select-none text-dp-border px-1 text-sm font-light">|</li>
            )}

            {/* Category links */}
            {categories.map((category) => (
              <li key={category.id} className="flex items-center">
                <Link
                  href={`/section/${category.slug}`}
                  className="font-sans text-xs uppercase tracking-widest font-semibold text-dp-text hover:text-dp-blue transition-colors whitespace-nowrap px-4 py-1 relative group"
                >
                  {category.name}
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-dp-gold scale-x-0 group-hover:scale-x-100 transition-transform" />
                </Link>
                {category !== categories[categories.length - 1] && (
                  <span className="select-none text-dp-border px-1 text-sm font-light">|</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
