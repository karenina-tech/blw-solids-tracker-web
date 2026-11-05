import Link from 'next/link';
import { BookOpen, Broccoli, CirclePlus, ListChecks } from 'lucide-react';
import { SITE_NAME } from '@/config/site';

const TABS = [
  { href: '/', label: 'Tracker', icon: ListChecks },
  { href: '/?tab=contribute', label: 'Contribute', icon: CirclePlus },
  { href: '/blog', label: 'Blog', icon: BookOpen },
] as const;

/** Same logo, name and tab bar as the app, with Blog highlighted, so the blog feels like part of the app. */
export function BlogHeader({ active = 'Blog' }: { active?: (typeof TABS)[number]['label'] | null }) {
  return (
    <header>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          aria-label={SITE_NAME}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent-100 transition-opacity hover:opacity-80">
          <Broccoli className="h-7 w-7 text-background" aria-hidden />
        </Link>
        <div>
          <p className="font-display text-2xl font-extrabold leading-none text-accent-700 sm:text-3xl">{SITE_NAME}</p>
          <p className="mt-1.5 text-base font-medium text-slate-600">Free / No account needed</p>
        </div>
      </div>

      <nav aria-label="Sections" className="mt-6 flex gap-6 border-b-2 border-accent-700/15">
        {TABS.map(({ href, label, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            aria-current={active === label ? 'page' : undefined}
            className={`-mb-0.5 inline-flex items-center gap-1.5 border-b-4 pb-2 font-display text-base font-bold transition-colors ${
              active === label ? 'border-seed-600 text-accent-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}>
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
