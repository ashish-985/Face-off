'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Swords, Gavel, Share2, Flame, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Match, UserProfile } from '@/lib/types';
import Link from 'next/link';

interface MatchResultModalProps {
  isOpen: boolean;
  match: Match;
  user: UserProfile;
  opponent: UserProfile;
  onClose: () => void;
  onShare: () => void;
}

export default function MatchResultModal({
  isOpen,
  match,
  user,
  opponent,
  onClose,
  onShare,
}: MatchResultModalProps) {
  const isWinner = match.winnerId === user.id || (match.votesA >= match.votesB && match.playerAId === user.id);

  useEffect(() => {
    if (isOpen && isWinner) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff3b5c', '#f59e0b', '#06b6d4', '#10b981'],
      });
    }
  }, [isOpen, isWinner]);

  if (!isOpen) return null;

  // Accurate percentage split calculation based on actual recorded vote tallies
  const isPlayerA = match.playerAId === user.id;
  const userVotes = isPlayerA ? (match.votesA || 0) : (match.votesB || 0);
  const oppVotes = isPlayerA ? (match.votesB || 0) : (match.votesA || 0);
  const totalVotes = userVotes + oppVotes;

  const userPercent = totalVotes > 0 ? Math.round((userVotes / totalVotes) * 100) : 60;
  const oppPercent = 100 - userPercent;

  const ratingDelta = isPlayerA ? (match.ratingDeltaA || 25) : (match.ratingDeltaB || 25);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg bg-arena-card border border-arena-border rounded-3xl p-6 sm:p-8 shadow-2xl text-center box-glow-gold animate-in fade-in zoom-in duration-200">
        {/* Top Victory Header */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-black shadow-lg mb-3">
          <Trophy className="w-8 h-8 animate-bounce" />
        </div>

        <h2 className="text-3xl font-black tracking-tight text-white uppercase">
          {isWinner ? '🏆 VICTORY!' : '⚔️ MATCH RESOLVED'}
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          5 valid votes recorded. Rating & XP settled.
        </p>

        {/* Head to Head Comparison */}
        <div className="my-6 p-4 rounded-2xl bg-arena-bg border border-arena-border">
          <div className="flex items-center justify-around">
            {/* User */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-xl overflow-hidden ring-2 ring-arena-accent mb-2">
                <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-bold text-white block">{user.username}</span>
              <span className="text-2xl font-black text-arena-accent">{userPercent}%</span>
              <span className="text-[10px] text-zinc-400 block font-mono">{userVotes} Votes</span>
            </div>

            <div className="text-zinc-500 font-black text-lg">VS</div>

            {/* Opponent */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-xl overflow-hidden ring-2 ring-zinc-700 mb-2">
                <img src={opponent.avatarUrl} alt={opponent.username} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-bold text-zinc-300 block">{opponent.username}</span>
              <span className="text-2xl font-black text-zinc-400">{oppPercent}%</span>
              <span className="text-[10px] text-zinc-400 block font-mono">{oppVotes} Votes</span>
            </div>
          </div>
        </div>

        {/* Rating & XP Gain Summary */}
        <div className="grid grid-cols-2 gap-3 text-left mb-6">
          <div className="p-3 rounded-xl bg-arena-card border border-arena-border">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Rating Update</span>
            <div className="flex items-center space-x-1 text-sm font-black text-arena-gold mt-1">
              <span>{user.rating - Math.abs(ratingDelta)}</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">{user.rating}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-arena-card border border-arena-border">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">XP Earned</span>
            <div className="text-sm font-black text-cyan-400 mt-1 flex items-center space-x-1">
              <span>+{isWinner ? '50' : '30'} Player XP</span>
            </div>
          </div>
        </div>

        {/* Win Streak Indicator */}
        {user.streak > 0 && (
          <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center space-x-2 text-amber-400 font-bold text-xs">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>🔥 {user.streak} Win Streak Active!</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Link
            href="/arena"
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-arena-accent to-red-600 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-md hover:from-red-600 hover:to-red-700"
          >
            <Swords className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </Link>

          <Link
            href="/judge"
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/30 font-bold text-xs flex items-center justify-center space-x-1"
          >
            <Gavel className="w-4 h-4" />
            <span>VOTE (3x)</span>
          </Link>

          <button
            onClick={onShare}
            className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center justify-center space-x-1 border border-zinc-700"
          >
            <Share2 className="w-4 h-4" />
            <span>SHARE RESULT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
