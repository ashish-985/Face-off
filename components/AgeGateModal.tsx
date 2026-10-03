'use client';

import React from 'react';
import { ShieldAlert, CheckCircle, LogOut } from 'lucide-react';
import { setAgeVerified } from '@/lib/storage';

interface AgeGateModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export default function AgeGateModal({ isOpen, onConfirm }: AgeGateModalProps) {
  if (!isOpen) return null;

  const handleAccept = () => {
    setAgeVerified(true);
    onConfirm();
  };

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-arena-card border border-arena-accent/40 rounded-2xl p-6 sm:p-8 shadow-2xl box-glow-accent text-center animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-arena-accent/10 border border-arena-accent/30 flex items-center justify-center text-arena-accent">
          <ShieldAlert className="w-8 h-8 animate-bounce" />
        </div>

        <h2 className="text-2xl font-black tracking-tight text-white mb-2">
          🔞 STRICTLY 18+ ONLY
        </h2>

        <p className="text-sm text-zinc-300 leading-relaxed mb-6">
          FACE-OFF is an 18+ social competition platform. By continuing, you declare and confirm under penalty of exclusion that you are at least 18 years of age.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleAccept}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-arena-accent via-red-600 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-arena-accent/20 transition-all transform active:scale-95 flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>I AM 18+ — CONTINUE</span>
          </button>

          <button
            onClick={handleExit}
            className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-semibold text-xs transition-colors flex items-center justify-center space-x-2 border border-zinc-800"
          >
            <LogOut className="w-4 h-4" />
            <span>EXIT PLATFORM</span>
          </button>
        </div>

        <p className="text-[11px] text-zinc-500 mt-4">
          Age declaration requirement enforced per platform rules.
        </p>
      </div>
    </div>
  );
}
