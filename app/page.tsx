'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Swords, Gavel, Trophy, ShieldAlert, ShieldCheck, Sparkles, Flame, CheckCircle, ArrowRight, Lock } from 'lucide-react';
import AgeGateModal from '@/components/AgeGateModal';
import AuthModal from '@/components/AuthModal';
import { getAgeVerified, getStoredCurrentUser } from '@/lib/storage';
import { UserProfile } from '@/lib/types';

export default function LandingPage() {
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const isVerified = getAgeVerified();
    if (!isVerified) {
      setShowAgeGate(true);
    }
    setUser(getStoredCurrentUser());
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      <AgeGateModal isOpen={showAgeGate} onConfirm={() => setShowAgeGate(false)} />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setUser(getStoredCurrentUser())}
      />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-arena-accent/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-widest mb-6">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Competitive Head-to-Head Arena</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-none">
          FACE-OFF 😎
        </h1>

        <p className="text-xl sm:text-2xl font-bold text-zinc-300 mt-4 max-w-2xl mx-auto">
          Think you&apos;ve got what it takes?
        </p>

        <p className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-arena-accent via-amber-400 to-cyan-400 bg-clip-text text-transparent mt-1">
          Compete. Judge. Climb.
        </p>

        {/* Core Mechanic Card Highlight */}
        <div className="my-8 max-w-xl mx-auto p-4 rounded-2xl bg-arena-card/80 border border-arena-border shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wide">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>THE MOST IMPORTANT RULE</span>
          </div>
          <p className="text-sm text-zinc-200 mt-2 font-medium">
            You must cast <strong className="text-cyan-400">3 judge votes</strong> before you unlock <strong className="text-emerald-400">1 Battle Credit</strong> to enter the arena!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mt-6">
          <Link
            href="/arena"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-arena-accent via-red-600 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-arena-accent/20 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Swords className="w-5 h-5" />
            <span>⚔️ Enter Arena</span>
          </Link>

          <Link
            href="/judge"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-arena-card hover:bg-arena-border text-white border border-arena-border font-black text-sm uppercase tracking-wider transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Gavel className="w-5 h-5 text-cyan-400" />
            <span>⚖️ Become a Judge</span>
          </Link>

          <Link
            href="/leaderboard"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-bold text-sm transition-all flex items-center justify-center space-x-2"
          >
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>🏆 Leaderboard</span>
          </Link>
        </div>

        {/* Sign In / Sign Up Link */}
        <div className="mt-6 text-xs text-zinc-400">
          {!user || user.username.startsWith('Contender_') ? (
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-arena-accent hover:underline font-bold"
            >
              Create New Account or Sign In →
            </button>
          ) : (
            <span>Logged in as <strong className="text-white">{user.username}</strong></span>
          )}
        </div>
      </section>

      {/* Core Game Loop Visualizer */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-arena-border/40">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">
            🔄 The Self-Sustaining Game Economy
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            How judging feeds matches & climbs global leaderboards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-arena-card border border-arena-border text-center relative">
            <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-black mb-3">
              1
            </div>
            <h3 className="text-sm font-bold text-white mb-1">🔞 18+ Confirmation</h3>
            <p className="text-xs text-zinc-400">Simple age declaration & profile creation.</p>
          </div>

          <div className="p-5 rounded-2xl bg-arena-card border border-cyan-500/30 text-center relative box-glow-cyan">
            <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center font-black mb-3">
              2
            </div>
            <h3 className="text-sm font-bold text-white mb-1">⚖️ Cast 3 Votes</h3>
            <p className="text-xs text-zinc-400">Judge head-to-head matches to unlock 1 Battle Credit.</p>
          </div>

          <div className="p-5 rounded-2xl bg-arena-card border border-arena-accent/30 text-center relative box-glow-accent">
            <div className="w-10 h-10 mx-auto rounded-xl bg-arena-accent/20 border border-arena-accent text-arena-accent flex items-center justify-center font-black mb-3">
              3
            </div>
            <h3 className="text-sm font-bold text-white mb-1">⚔️ Enter Battle</h3>
            <p className="text-xs text-zinc-400">Get matched with players near your Elo rating.</p>
          </div>

          <div className="p-5 rounded-2xl bg-arena-card border border-amber-500/30 text-center relative box-glow-gold">
            <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/20 border border-amber-400 text-amber-400 flex items-center justify-center font-black mb-3">
              4
            </div>
            <h3 className="text-sm font-bold text-white mb-1">🏆 5-Vote Result</h3>
            <p className="text-xs text-zinc-400">Crowd decides winner. Win rating & climb rank!</p>
          </div>
        </div>
      </section>

      {/* Footer with Legal & Privacy Links */}
      <footer className="border-t border-arena-border/40 py-6 text-center text-xs text-zinc-500 space-y-2">
        <div className="flex items-center justify-center space-x-4 font-semibold text-zinc-400">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service & Guidelines
          </Link>
        </div>
        <p>FACE-OFF 😎 • 18+ Social Competition Platform • Elo Rating & Crowd Judging System</p>
      </footer>
    </div>
  );
}
