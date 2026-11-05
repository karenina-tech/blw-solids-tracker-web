'use client';

import Link from 'next/link';
import { PenLine } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBlogPosts } from '@/components/blog/BlogProvider';

const MAX_LINKS = 3;

export function BlogSection() {
  const { t } = useTranslation();
  const posts = useBlogPosts();

  if (posts.length === 0) {
    return (
      <section data-sheet aria-labelledby="blog-heading" className="sheet-gradient rounded-2xl p-6">
        <h2 id="blog-heading" className="mb-2 text-xl font-bold text-accent-700">
          {t('blog.title')}
        </h2>
        <p className="flex items-start gap-2 text-base text-slate-700">
          <PenLine className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" aria-hidden />
          {t('blog.comingSoon')}
        </p>
      </section>
    );
  }

  return (
    <section data-sheet aria-labelledby="blog-heading" className="sheet-gradient rounded-2xl p-6">
      <div className="flex items-baseline justify-between mb-2">
        <h2 id="blog-heading" className="text-xl font-bold text-accent-700">
          {t('blog.title')}
        </h2>
        <Link href="/blog" className="text-base font-medium text-accent-600 hover:text-accent-700">
          {t('blog.allArticles')}
        </Link>
      </div>
      <ul className="divide-y divide-slate-100">
        {posts.slice(0, MAX_LINKS).map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block py-2.5 text-base text-slate-700 hover:text-slate-900">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
