'use client';

import React, { useState, useEffect } from 'react';
import { Match, UserProfile } from '@/lib/types';
import { castJudgeVote } from '@/lib/storage';
import { getTierFromElo } from '@/lib/tiers';
import TierBadge from '@/components/TierBadge';
import { Trophy, Flame, ShieldAlert, CheckCircle, Sparkles } from 'lucide-react';

interface VoteCardProps {
  match: Match;
  playerA: UserProfile;
  playerB: UserProfile;
  currentUserId: string;
  onVoteCast: (unlockedCredit: boolean, matchResolved: boolean) => void;
}

export default function VoteCard({
  match,
  playerA,
  playerB,
  currentUserId,
  onVoteCast,
}: VoteCardProps) {
  const [voted, setVoted] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<'A' | 'B' | null>(null);
  const [error, setError] = useState('');

  const tierA = getTierFromElo(playerA.rating);
  const tierB = getTierFromElo(playerB.rating);

  // Reset internal voting state when match changes!
  useEffect(() => {
    setVoted(false);
    setSelectedWinner(null);
    setError('');
  }, [match.id]);

  const handleVote = (winnerId: string, choice: 'A' | 'B') => {
    try {
      setError('');
      const result = castJudgeVote(currentUserId, match.id, winnerId);
      setVoted(true);
      setSelectedWinner(choice);
      onVoteCast(result.unlockedCredit, result.matchResolved);
    } catch (err: any) {
      setError(err.message || 'Failed to submit vote.');
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-arena-card border border-arena-border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden box-glow-accent">
      {/* Top Header */}
      <div className="text-center mb-6">
        <span className="px-3 py-1 rounded-full bg-arena-accent/10 border border-arena-accent/30 text-arena-accent font-black text-xs uppercase tracking-widest inline-flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FACE-OFF JUDGE ARENA</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
          WHO WINS?
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Cast 1 vote toward unlocking your next Battle Token
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-semibold flex items-center justify-center space-x-2">
          <ShieldAlert className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Head-to-Head Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative my-4">
        {/* VS Badge in Middle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden sm:flex w-12 h-12 rounded-full bg-arena-accent text-white font-black text-sm items-center justify-center shadow-lg border-2 border-arena-card">
          VS
        </div>

        {/* Player A Card */}
        <div
          className={`relative rounded-2xl p-4 border transition-all duration-300 ${tierA.cardGlow} ${
            selectedWinner === 'A'
              ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
              : `${tierA.cardBorder} bg-arena-bg hover:border-arena-accent/40`
          }`}
        >
          <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-zinc-900">
            <img
              src={playerA.avatarUrl}
              alt={playerA.username}
              className="w-full h-full object-cover"
            />
            {playerA.streak >= 3 && (
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-black font-extrabold text-[10px] flex items-center space-x-1 shadow">
                <Flame className="w-3 h-3 fill-black" />
                <span>{playerA.streak} Streak</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="mb-1">
              <TierBadge elo={playerA.rating} size="sm" />
            </div>
            <h3 className="text-lg font-black text-white">{playerA.username}</h3>
            <div className="flex items-center justify-center space-x-3 text-xs text-zinc-400 mt-1">
              <span className="font-mono text-arena-gold font-bold">{playerA.rating} Elo</span>
              <span>•</span>
              <span>{playerA.wins}W - {playerA.losses}L</span>
            </div>

            <button
              onClick={() => handleVote(playerA.id, 'A')}
              disabled={voted}
              className={`w-full mt-4 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all transform active:scale-95 ${
                selectedWinner === 'A'
                  ? 'bg-emerald-500 text-black'
                  : 'bg-gradient-to-r from-arena-accent to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg'
              }`}
            >
              {selectedWinner === 'A' ? '✓ VOTED A WINS' : `VOTE ${playerA.username.toUpperCase()}`}
            </button>
          </div>
        </div>

        {/* Player B Card */}
        <div
          className={`relative rounded-2xl p-4 border transition-all duration-300 ${tierB.cardGlow} ${
            selectedWinner === 'B'
              ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
              : `${tierB.cardBorder} bg-arena-bg hover:border-arena-accent/40`
          }`}
        >
          <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-zinc-900">
            <img
              src={playerB.avatarUrl}
              alt={playerB.username}
              className="w-full h-full object-cover"
            />
            {playerB.streak >= 3 && (
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-black font-extrabold text-[10px] flex items-center space-x-1 shadow">
                <Flame className="w-3 h-3 fill-black" />
                <span>{playerB.streak} Streak</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="mb-1">
              <TierBadge elo={playerB.rating} size="sm" />
            </div>
            <h3 className="text-lg font-black text-white">{playerB.username}</h3>
            <div className="flex items-center justify-center space-x-3 text-xs text-zinc-400 mt-1">
              <span className="font-mono text-arena-gold font-bold">{playerB.rating} Elo</span>
              <span>•</span>
              <span>{playerB.wins}W - {playerB.losses}L</span>
            </div>

            <button
              onClick={() => handleVote(playerB.id, 'B')}
              disabled={voted}
              className={`w-full mt-4 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all transform active:scale-95 ${
                selectedWinner === 'B'
                  ? 'bg-emerald-500 text-black'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg'
              }`}
            >
              {selectedWinner === 'B' ? '✓ VOTED B WINS' : `VOTE ${playerB.username.toUpperCase()}`}
            </button>
          </div>
        </div>
      </div>

      {/* Vote Progress / Match Votes Status */}
      <div className="mt-6 pt-4 border-t border-arena-border/60 flex items-center justify-between text-xs text-zinc-400">
        <span className="flex items-center space-x-1">
          <Trophy className="w-4 h-4 text-arena-gold" />
          <span>Match Progress: <strong className="text-white">{match.totalVotes}/5 Votes</strong></span>
        </span>
        <span className="text-[11px] text-zinc-500">
          5 valid votes lock final result
        </span>
      </div>
    </div>
  );
}

