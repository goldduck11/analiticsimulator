import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';


const _geist = Inter({
  variable: '--font-geist',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

const _geistMono = Roboto_Mono({
  variable: '--font-geist-mono',
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Analyst Trainer — тренажёр аналитика',
  description: 'Интерактивный тренажёр: SQL, продуктовые метрики, A/B-тесты и разбор кейсов.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${_geist.variable} ${_geistMono.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}