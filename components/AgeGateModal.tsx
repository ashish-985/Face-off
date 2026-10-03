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
      <div className="relative w-full max-w-md bg-arena-card border border-arena-border rounded-2xl p-6 sm:p-8 shadow-2xl text-center animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black tracking-tight text-white mb-2">
          AGE VERIFICATION REQUIRED
        </h2>

        <p className="text-sm text-zinc-300 leading-relaxed mb-6">
          FACE-OFF is a competitive arena platform. Please confirm that you are at least 18 years of age to enter.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleAccept}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-arena-accent via-red-600 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-arena-accent/20 transition-all transform active:scale-95 flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>I CONFIRM I AM 18+ — ENTER</span>
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
          Age declaration required per community guidelines.
        </p>
      </div>
    </div>
  );
}
