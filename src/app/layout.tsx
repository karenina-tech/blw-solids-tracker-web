import type { Metadata } from 'next';
import { Atkinson_Hyperlegible_Next, Bricolage_Grotesque, DM_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { I18nProvider } from '@/components/I18nProvider';
import { BlogProvider } from '@/components/blog/BlogProvider';
import { getAllPosts } from '@/lib/blog';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/config/site';
import './globals.css';

// Display: headings and the app name. Body: Atkinson Hyperlegible, built for readability.
// Mono: step counters and dates.
const display = Bricolage_Grotesque({ subsets: ['latin'], axes: ['opsz', 'wdth'], variable: '--ff-display' });
const body = Atkinson_Hyperlegible_Next({ subsets: ['latin'], variable: '--ff-body' });
const mono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--ff-mono' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Baby-Led Weaning 30-Day Plan & Allergen Tracker`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'baby-led weaning',
    'BLW',
    'starting solids',
    'baby food introduction plan',
    'allergen introduction',
    'baby solids checklist',
    'complementary feeding',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Baby-Led Weaning 30-Day Plan`,
    description: SITE_DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Baby-Led Weaning 30-Day Plan`,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: ['en', 'es'],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const blogLinks = getAllPosts().map(({ slug, title }) => ({ slug, title }));

  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning>
      <body
        className="relative min-h-full flex flex-col bg-background"
        style={{ backgroundImage: 'url(/food-pattern.svg)', backgroundSize: '500px 400px' }}>
        <I18nProvider>
          <BlogProvider posts={blogLinks}>{children}</BlogProvider>
        </I18nProvider>
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </body>
    </html>
  );
}
