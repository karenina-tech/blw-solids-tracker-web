'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useBlogPosts } from '@/components/blog/BlogProvider';

const MAX_LINKS = 3;

export function BlogSection() {
  const { t } = useTranslation();
  const posts = useBlogPosts();
  if (posts.length === 0) return null;

  return (
    <section data-sheet aria-labelledby="blog-heading" className="sheet-gradient rounded-2xl p-6">
      <div className="flex items-baseline justify-between mb-2">
        <h2 id="blog-heading" className="text-base font-semibold text-slate-700">
          {t('blog.title')}
        </h2>
        <Link href="/blog" className="text-sm text-accent-600 hover:text-accent-700 hover:underline">
          {t('blog.allArticles')}
        </Link>
      </div>
      <ul className="divide-y divide-slate-100">
        {posts.slice(0, MAX_LINKS).map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block py-2 text-sm text-slate-600 hover:text-slate-800 hover:underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
