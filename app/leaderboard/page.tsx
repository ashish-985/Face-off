'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Gavel, Flame, ShieldCheck, Award, Sparkles } from 'lucide-react';
import { getStoredUsers, getStoredCurrentUser } from '@/lib/storage';
import { UserProfile } from '@/lib/types';
import { getLevelFromXp } from '@/lib/xp';
import TierBadge from '@/components/TierBadge';

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'PLAYER' | 'JUDGE'>('PLAYER');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const uList = getStoredUsers();
    setUsers(uList);
    setCurrentUser(getStoredCurrentUser());
  }, []);

  const playerLeaderboard = [...users].sort((a, b) => b.rating - a.rating);
  const judgeLeaderboard = [...users].sort((a, b) => b.judgeXp - a.judgeXp);

  const activeList = tab === 'PLAYER' ? playerLeaderboard : judgeLeaderboard;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
          <Trophy className="w-4 h-4" />
          <span>GLOBAL LEADERBOARDS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          🏆 HALL OF TITANS
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Competitive performance & participation rankings updated real-time
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center p-1 bg-arena-card border border-arena-border rounded-2xl max-w-md mx-auto mb-8">
        <button
          onClick={() => setTab('PLAYER')}
          className={`flex-1 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
            tab === 'PLAYER'
              ? 'bg-gradient-to-r from-arena-accent to-red-600 text-white shadow-lg'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>⚔️ Player Leaderboard</span>
        </button>

        <button
          onClick={() => setTab('JUDGE')}
          className={`flex-1 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
            tab === 'JUDGE'
              ? 'bg-cyan-500 text-black shadow-lg font-black'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>⚖️ Judge Leaderboard</span>
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-arena-card border border-arena-border rounded-3xl overflow-hidden shadow-2xl">
        <div className="divide-y divide-arena-border/60">
          {activeList.map((user, idx) => {
            const rank = idx + 1;
            const isCurrentUser = currentUser?.id === user.id;
            const playerLevel = getLevelFromXp(user.playerXp).level;
            const judgeLevel = getLevelFromXp(user.judgeXp).level;

            const accuracy =
              user.totalVotesCast > 0
                ? Math.round((user.judgeAgreements / user.totalVotesCast) * 100)
                : 70;

            return (
              <div
                key={user.id}
                className={`p-4 sm:p-5 flex items-center justify-between transition-colors ${
                  isCurrentUser
                    ? 'bg-arena-accent/10 border-l-4 border-l-arena-accent'
                    : 'hover:bg-arena-bg/50'
                }`}
              >
                {/* Rank & User Info */}
                <div className="flex items-center space-x-4">
                  {/* Rank Badge */}
                  <div
                    className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
                      rank === 1
                        ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-black shadow-lg shadow-amber-500/20'
                        : rank === 2
                        ? 'bg-zinc-300 text-black font-extrabold'
                        : rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-arena-bg text-zinc-400 border border-arena-border'
                    }`}
                  >
                    #{rank}
                  </div>

                  {/* Avatar & Username */}
                  <Link href={`/profile/${user.id}`} className="flex items-center space-x-3 group">
                    <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-arena-accent transition-all">
                      <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white group-hover:text-arena-accent transition-colors">
                          {user.username}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] bg-arena-accent text-white font-black px-1.5 py-0.5 rounded">
                            YOU
                          </span>
                        )}
                        {tab === 'PLAYER' && <TierBadge elo={user.rating} size="sm" />}
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center space-x-2 mt-0.5">
                        {tab === 'PLAYER' ? (
                          <>
                            <span>{user.wins}W - {user.losses}L</span>
                            {user.streak > 0 && (
                              <span className="text-amber-400 font-bold flex items-center">
                                <Flame className="w-3 h-3 fill-amber-400 mr-0.5" />
                                {user.streak}
                              </span>
                            )}
                          </>
                        ) : (
                          <span>Accuracy: <strong className="text-cyan-400">{accuracy}%</strong> ({user.totalVotesCast} Votes)</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Score Column */}
                <div className="text-right">
                  {tab === 'PLAYER' ? (
                    <div>
                      <div className="text-lg font-black text-arena-gold font-mono">
                        {user.rating} Elo
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Lvl {playerLevel} Player
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-lg font-black text-cyan-400 font-mono">
                        {user.judgeXp} XP
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Lvl {judgeLevel} Judge
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

