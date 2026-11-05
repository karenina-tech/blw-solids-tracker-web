import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts } from '@/lib/blog';
import { SITE_NAME } from '@/config/site';

export const metadata: Metadata = {
  title: 'Baby-Led Weaning Guides',
  description:
    'Practical, source-backed guides on starting solids with baby-led weaning: readiness signs, allergens, safety and first foods.',
  alternates: { canonical: '/blog' },
};

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

export default function BlogIndexPage() {
  const posts = getAllPosts();
  // No published articles yet: the section should not exist (and stays out of the sitemap).
  if (posts.length === 0) notFound();

  return (
    <main className="flex flex-1 flex-col items-center p-4 pt-10 sm:pt-14">
      <div className="w-full max-w-2xl">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700 hover:underline">
            {SITE_NAME}
          </Link>
          <span aria-hidden="true"> / </span>
          <span>Blog</span>
        </nav>
        <h1 className="mt-4 text-3xl font-bold text-accent-700">Baby-Led Weaning Guides</h1>
        <p className="mt-2 text-slate-600">
          Source-backed guides to help you start solids with confidence.
        </p>

        <ul className="mt-8 space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block rounded-2xl bg-white p-5 shadow-md transition-colors hover:bg-accent-50">
                <h2 className="text-xl font-semibold text-accent-700">{post.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{post.description}</p>
                <p className="mt-3 text-xs text-slate-400">
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
