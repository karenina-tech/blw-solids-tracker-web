import { Beef, Egg, Sprout } from 'lucide-react';

export type DietKind = 'standard' | 'vegetarian' | 'vegan';

/** Plant-based = sprout, animal product (not meat) = egg, meat or fish = beef. */
export function DietIcon({ type, className = 'h-5 w-5 text-accent-600' }: { type?: string; className?: string }) {
  if (type === 'standard') return <Beef className={className} aria-hidden />;
  if (type === 'vegetarian') return <Egg className={className} aria-hidden />;
  return <Sprout className={className} aria-hidden />;
}
