'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center shadow-2xl">
          <h2 className="text-2xl font-black text-red-500 mb-2">
            GLOBAL ARENA ERROR
          </h2>
          <p className="text-xs text-zinc-400 mb-6">
            A critical system error occurred. Please refresh or reset the application.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg"
          >
            RESET ARENA
          </button>
        </div>
      </body>
    </html>
  );
}
