import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'FACE-OFF 😎 — 18+ Head-to-Head Social Competition',
  description: 'Compete. Judge. Climb. The 18+ social competition game where votes unlock battles.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-arena-bg text-white min-h-screen flex flex-col antialiased selection:bg-arena-accent selection:text-white pb-16 md:pb-0">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
