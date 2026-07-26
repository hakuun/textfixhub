import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Free Online Text Tools',
  description: 'Free online text tools to alphabetize lists, remove line breaks, count sentences, and generate random text.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
