import type { Metadata } from 'next';
import Link from 'next/link';
import { PenLine } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';
import { BlogHeader } from '@/components/blog/BlogHeader';

export function generateMetadata(): Metadata {
  return {
    title: 'BLW Blog',
    description:
      'Guides, tips and personal stories about starting solids with baby-led weaning: readiness, allergens, safety and first foods.',
    alternates: { canonical: '/blog' },
    // Nothing to index until the first article is published.
    robots: getAllPosts().length === 0 ? { index: false, follow: true } : undefined,
  };
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="flex flex-1 flex-col items-center p-4 pt-10 sm:pt-14">
      <div className="w-full max-w-5xl">
        <BlogHeader />
        {/* The header already says where you are; keep a heading for screen readers and search engines. */}
        <h1 className="sr-only">BLW Blog</h1>
        <p className="mt-8 text-lg text-slate-700">
          Guides, tips and personal stories from my baby-led weaning journey.
        </p>

        {posts.length === 0 && (
          <section className="sheet-gradient mt-8 rounded-2xl p-8 text-center">
            <PenLine className="mx-auto h-8 w-8 text-seed-600" aria-hidden />
            <h2 className="mt-3 text-2xl font-bold text-accent-700">The blog is getting ready</h2>
            <p className="mx-auto mt-2 max-w-md text-base leading-relaxed text-slate-700">
              I&apos;m writing my first guides and personal stories about baby-led weaning. Check back soon.
            </p>
          </section>
        )}

        <ul className="mt-8 space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block rounded-2xl bg-accent-100/25 p-5 shadow-md transition-colors hover:bg-accent-100/40">
                <h2 className="text-xl font-bold text-accent-700">{post.title}</h2>
                <p className="mt-1 text-base text-slate-700">{post.description}</p>
                <p className="mt-3 text-base text-slate-600">
                  {formatDate(post.date)} &middot; {post.readingMinutes} min read
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
