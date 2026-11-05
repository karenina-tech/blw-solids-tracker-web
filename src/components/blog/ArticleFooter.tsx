import Link from 'next/link';
import type { PostMeta } from '@/lib/blog';

export function ArticleFooter({ sources }: { sources: PostMeta['sources'] }) {
  return (
    <footer className="mt-12 space-y-8">
      <aside className="rounded-2xl bg-white p-6 text-center shadow-md">
        <p className="text-base font-semibold text-slate-700">Ready to plan your baby&apos;s first foods?</p>
        <p className="mt-1 text-sm text-slate-600">
          Check readiness and get a personalised 30-day plan, free.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-xl bg-seed-600 hover:bg-seed-500 px-6 py-2 text-sm font-medium text-white transition-colors">
          Open the BLW Solids Tracker
        </Link>
      </aside>

      <section aria-labelledby="sources-heading">
        <h2 id="sources-heading" className="text-sm font-semibold text-slate-700">
          Sources
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          {sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-slate-800">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs leading-5 text-slate-500">
        This article is general information, not medical advice. Every baby is different: talk to your
        pediatrician before starting solids or if you have concerns about allergies or choking.
      </p>
    </footer>
  );
}
