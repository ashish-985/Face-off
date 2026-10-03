'use client';

import React, { useState, useEffect } from 'react';
import VoteCard from '@/components/VoteCard';
import {
  getStoredCurrentUser,
  getStoredMatches,
  getStoredUsers,
  getStoredVotes,
  ensureActiveMatchesInQueue,
} from '@/lib/storage';
import { Match, UserProfile } from '@/lib/types';
import { Gavel, Unlock, Sparkles, CheckCircle2, Trophy, Flame, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function JudgePage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeMatches, setActiveMatches] = useState<{ match: Match; playerA: UserProfile; playerB: UserProfile }[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [unlockedNotice, setUnlockedNotice] = useState(false);

  const loadData = (forceNewMatches: boolean = false) => {
    // 1. Ensure queue always has active matches available
    ensureActiveMatchesInQueue(forceNewMatches);

    const user = getStoredCurrentUser();
    const matches = getStoredMatches();
    const users = getStoredUsers();
    const votes = getStoredVotes();

    setCurrentUser(user);

    // 2. Filter matches that are WAITING_FOR_VOTES, where judge isn't participant, and judge hasn't voted yet
    const validMatches: { match: Match; playerA: UserProfile; playerB: UserProfile }[] = [];

    matches.forEach((m) => {
      if (m.status !== 'WAITING_FOR_VOTES') return;
      if (m.playerAId === user.id || m.playerBId === user.id) return;

      const hasVoted = votes.some((v) => v.judgeId === user.id && v.matchId === m.id);
      if (hasVoted) return;

      const pA = users.find((u) => u.id === m.playerAId);
      const pB = users.find((u) => u.id === m.playerBId);

      if (pA && pB) {
        validMatches.push({ match: m, playerA: pA, playerB: pB });
      }
    });

    setActiveMatches(validMatches);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVoteCast = (unlockedCredit: boolean, matchResolved: boolean) => {
    if (unlockedCredit) {
      setUnlockedNotice(true);
    }
    const updated = getStoredCurrentUser();
    setCurrentUser(updated);

    setTimeout(() => {
      loadData();
      setCurrentMatchIndex((prev) => prev + 1);
    }, 400);
  };

  const handleLoadNewMatchesClick = () => {
    // Force generate new unvoted matches and reset queue index to 0!
    setCurrentMatchIndex(0);
    loadData(true);
  };

  if (!currentUser) return null;

  const currentItem = activeMatches[currentMatchIndex] || activeMatches[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Header & Rule Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">
          <Gavel className="w-4 h-4" />
          <span>FACE-OFF JUDGE ARENA</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white">
          ⚖️ Vote Before You Play
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Every 3 votes earns 1 Battle Credit to enter head-to-head matches.
        </p>
      </div>

      {/* Progress Bar (3 Votes = 1 Credit) */}
      <div className="mb-8 p-6 rounded-3xl bg-arena-card border border-arena-border shadow-xl box-glow-cyan">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="text-zinc-300 flex items-center space-x-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>PROGRESS TO NEXT BATTLE CREDIT</span>
          </span>
          <span className="text-cyan-400 font-mono text-sm">
            {currentUser.pendingVotesCount} / 3 VOTES
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-arena-bg overflow-hidden border border-arena-border">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
            style={{ width: `${(currentUser.pendingVotesCount / 3) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-3">
          <span>Available Credits: <strong className="text-emerald-400 font-mono text-xs">{currentUser.battleCredits} Battle Credit(s)</strong></span>
          <span>Judge XP: <strong className="text-amber-400">{currentUser.judgeXp} XP</strong></span>
        </div>
      </div>

      {/* Battle Credit Unlocked Banner Notification */}
      {unlockedNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border border-emerald-500/50 text-center animate-in zoom-in duration-300">
          <div className="flex items-center justify-center space-x-2 text-emerald-400 font-black text-base">
            <Unlock className="w-5 h-5 animate-bounce" />
            <span>🔓 BATTLE CREDIT UNLOCKED!</span>
          </div>
          <p className="text-xs text-zinc-300 mt-1">
            You completed 3 votes! You can now enter the Arena or keep judging to hoard tokens.
          </p>
          <Link
            href="/arena"
            className="inline-flex items-center space-x-2 mt-3 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg"
          >
            <span>ENTER ARENA NOW ⚔️</span>
          </Link>
        </div>
      )}

      {/* Main Voting Queue */}
      {currentItem ? (
        <VoteCard
          key={currentItem.match.id}
          match={currentItem.match}
          playerA={currentItem.playerA}
          playerB={currentItem.playerB}
          currentUserId={currentUser.id}
          onVoteCast={handleVoteCast}
        />
      ) : (
        <div className="text-center py-16 px-6 bg-arena-card border border-arena-border rounded-3xl">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-bounce" />
          <h3 className="text-2xl font-black text-white">Queue Refreshed!</h3>
          <p className="text-sm text-zinc-400 mt-2 max-w-md mx-auto">
            You have judged all active matches in this round. Click below to load brand new unvoted matches!
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleLoadNewMatchesClick}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 transform active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>LOAD NEW MATCHES ⚖️</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
