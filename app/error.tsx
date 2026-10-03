'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="p-8 max-w-md w-full rounded-3xl bg-arena-card border border-arena-accent/40 shadow-2xl box-glow-accent">
        <div className="w-14 h-14 rounded-2xl bg-arena-accent/10 border border-arena-accent/30 text-arena-accent mx-auto flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-black text-white">ARENA SYSTEM EXCEPTION</h2>
        <p className="text-xs text-zinc-400 mt-2">
          An unexpected error occurred while loading this page.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => reset()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-arena-accent to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>TRY AGAIN</span>
          </button>

          <Link
            href="/"
            className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs flex items-center justify-center space-x-2 border border-zinc-700"
          >
            <Home className="w-4 h-4" />
            <span>RETURN HOME</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
