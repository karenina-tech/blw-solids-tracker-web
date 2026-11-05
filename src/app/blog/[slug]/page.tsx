import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleBody } from '@/components/blog/ArticleBody';
import { ArticleFooter } from '@/components/blog/ArticleFooter';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { SITE_NAME, SITE_URL } from '@/config/site';

type Props = { params: Promise<{ slug: string }> };

// Only published slugs exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/blog/${post.slug}`,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
  };
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    author: { '@type': 'Person', name: 'Karenina', url: 'https://kareninatech.com' },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };

  return (
    <main className="flex flex-1 flex-col items-center p-4 pt-10 sm:pt-14">
      <article className="w-full max-w-2xl">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700 hover:underline">
            {SITE_NAME}
          </Link>
          <span aria-hidden="true"> / </span>
          <Link href="/blog" className="hover:text-slate-700 hover:underline">
            Blog
          </Link>
        </nav>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-accent-700 sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-slate-500">
          {formatDate(post.date)}
          {post.updated && post.updated !== post.date ? ` (updated ${formatDate(post.updated)})` : ''} &middot;{' '}
          {post.readingMinutes} min read
        </p>

        <div className="mt-6">
          <ArticleBody markdown={post.content} />
        </div>

        <ArticleFooter sources={post.sources} />
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </main>
  );
}
