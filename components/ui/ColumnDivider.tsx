import { cn } from '@/lib/utils';

interface ColumnDividerProps {
  orientation?: 'horizontal' | 'vertical';
  double?: boolean;
  className?: string;
}

/**
 * ColumnDivider
 *
 * A simple NYT-style decorative rule.
 *
 * - orientation="horizontal" (default): renders an <hr> with a 2px solid black
 *   top border. When `double` is true, uses a CSS double border (border-double
 *   border-4), matching the NYT's thick section separators.
 *
 * - orientation="vertical": renders a full-height <div> with a 1px right border
 *   in the nyt-border colour. Useful as a flex/grid column separator.
 */
export default function ColumnDivider({
  orientation = 'horizontal',
  double = false,
  className,
}: ColumnDividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        aria-hidden="true"
        className={cn('border-r border-dp-border h-full self-stretch', className)}
      />
    );
  }

  // Horizontal divider
  return (
    <hr
      aria-hidden="true"
      className={cn(
        'w-full border-0',
        double
          ? // Double border — matches "border-double border-dp-border-light border-4" spec
            'border-t-4 border-double border-dp-border-light'
          : // Standard 2px solid rule
            'border-t-2 border-dp-border-light',
        className
      )}
    />
  );
}
