import type { Metadata } from 'next';
import { I18nProvider } from '@/components/I18nProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'BLW Solids Tracker',
  description: 'Generate a personalised 30-day Baby-Led Weaning solid food introduction plan.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body
        className="relative min-h-full flex flex-col bg-background"
        style={{ backgroundImage: 'url(/food-pattern.svg)', backgroundSize: '500px 400px' }}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
