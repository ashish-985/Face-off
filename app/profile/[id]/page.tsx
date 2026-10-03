'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getStoredUsers, getStoredCurrentUser, isUserBlocked } from '@/lib/storage';
import { UserProfile } from '@/lib/types';
import { getLevelFromXp } from '@/lib/xp';
import BadgeGrid from '@/components/BadgeGrid';
import ReportModal from '@/components/ReportModal';
import BlockModal from '@/components/BlockModal';
import { Trophy, Gavel, Flame, ShieldAlert, UserX, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [blockedNotice, setBlockedNotice] = useState(false);

  useEffect(() => {
    const users = getStoredUsers();
    const curr = getStoredCurrentUser();
    const target = users.find((u) => u.id === userId);

    setCurrentUser(curr);
    if (target) {
      setProfileUser(target);
      if (isUserBlocked(curr.id, target.id)) {
        setBlockedNotice(true);
      }
    }
  }, [userId]);

  if (!profileUser || !currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 text-center text-zinc-400">
        User profile not found.
      </div>
    );
  }

  const playerLevel = getLevelFromXp(profileUser.playerXp);
  const judgeLevel = getLevelFromXp(profileUser.judgeXp);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ReportModal
        isOpen={showReport}
        targetUsername={profileUser.username}
        targetUserId={profileUser.id}
        reporterId={currentUser.id}
        onClose={() => setShowReport(false)}
      />

      <BlockModal
        isOpen={showBlock}
        targetUsername={profileUser.username}
        targetUserId={profileUser.id}
        blockerId={currentUser.id}
        onClose={() => setShowBlock(false)}
        onBlocked={() => {
          setBlockedNotice(true);
        }}
      />

      <Link
        href="/leaderboard"
        className="inline-flex items-center space-x-1 text-xs font-bold text-zinc-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Leaderboard</span>
      </Link>

      {blockedNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold text-center">
          🚫 You have blocked this user. They cannot match with you or interact with your profile.
        </div>
      )}

      {/* Main Profile Header */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-arena-card border border-arena-border shadow-2xl overflow-hidden mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-arena-border shrink-0">
            <img src={profileUser.avatarUrl} alt={profileUser.username} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-3xl font-black text-white">{profileUser.username}</h1>
                <p className="text-xs text-zinc-400 mt-1">{profileUser.bio}</p>
              </div>

              {/* Moderation Actions (Report & Block) */}
              {currentUser.id !== profileUser.id && (
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => setShowReport(true)}
                    className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center space-x-1 border border-amber-500/30"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Report</span>
                  </button>
                  <button
                    onClick={() => setShowBlock(true)}
                    className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs flex items-center space-x-1 border border-red-500/30"
                  >
                    <UserX className="w-4 h-4" />
                    <span>Block</span>
                  </button>
                </div>
              )}
            </div>

            {/* Badges & Stats */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
              <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs">
                Rating: {profileUser.rating} Elo
              </div>
              <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs">
                Lvl {playerLevel.level} Player • Lvl {judgeLevel.level} Judge
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-arena-border/60 text-center">
          <div className="p-3 rounded-2xl bg-arena-bg/60 border border-arena-border">
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">Battles</span>
            <span className="text-xl font-black text-white">{profileUser.wins + profileUser.losses}</span>
          </div>

          <div className="p-3 rounded-2xl bg-arena-bg/60 border border-arena-border">
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">Record</span>
            <span className="text-xl font-black text-emerald-400">{profileUser.wins}W - {profileUser.losses}L</span>
          </div>

          <div className="p-3 rounded-2xl bg-arena-bg/60 border border-arena-border">
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">Votes Cast</span>
            <span className="text-xl font-black text-cyan-400">{profileUser.totalVotesCast}</span>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-arena-card border border-arena-border shadow-xl">
        <h2 className="text-xl font-black text-white mb-4">🏆 Earned Badges</h2>
        <BadgeGrid unlockedBadgeIds={profileUser.badges} />
      </div>
    </div>
  );
}
