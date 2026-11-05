import type { Metadata } from 'next';
import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { BlogHeader } from '@/components/blog/BlogHeader';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center p-4 pt-10 sm:pt-14">
      <div className="w-full max-w-5xl">
        <BlogHeader active={null} />

        <section className="sheet-gradient mt-8 rounded-2xl p-8 text-center sm:p-12">
          <SearchX className="mx-auto h-10 w-10 text-seed-600" aria-hidden />
          <h1 className="mt-4 text-3xl font-bold text-accent-700">I couldn&apos;t find that page</h1>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-slate-700">
            The link may have a typo, or the page may have moved. The tracker is a good place to start.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-xl bg-seed-600 px-7 py-2.5 text-base font-semibold text-white transition-colors hover:bg-seed-500">
              Go to the tracker
            </Link>
            <Link
              href="/blog"
              className="rounded-xl px-5 py-2.5 text-base font-semibold text-slate-600 transition-colors hover:bg-seed-600/10 hover:text-seed-700">
              Visit the blog
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
