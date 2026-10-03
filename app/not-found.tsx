'use client';

import React from 'react';
import Link from 'next/link';
import { Swords, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="p-8 max-w-md w-full rounded-3xl bg-arena-card border border-arena-border shadow-2xl">
        <Swords className="w-16 h-16 text-arena-accent mx-auto mb-4" />
        <h1 className="text-4xl font-black text-white font-mono">404</h1>
        <h2 className="text-xl font-bold text-zinc-200 mt-1">PAGE NOT FOUND</h2>
        <p className="text-xs text-zinc-400 mt-2">
          The arena page you are looking for does not exist or has been moved.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-arena-accent to-red-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg"
        >
          <Home className="w-4 h-4" />
          <span>RETURN TO ARENA HOME</span>
        </Link>
      </div>
    </div>
  );
}
