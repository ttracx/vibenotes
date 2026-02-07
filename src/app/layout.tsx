import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'VibeNotes - Simple Markdown Note-Taking',
  description: 'A beautiful, simple note-taking app with markdown support. Organize your thoughts with folders, search instantly, and export to Markdown or PDF.',
  keywords: ['notes', 'markdown', 'note-taking', 'productivity', 'organization'],
  authors: [{ name: 'VibeCaaS' }],
  openGraph: {
    title: 'VibeNotes - Simple Markdown Note-Taking',
    description: 'A beautiful, simple note-taking app with markdown support.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
