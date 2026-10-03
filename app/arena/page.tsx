'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Swords, Gavel, ShieldAlert, Sparkles, Loader2, Trophy, Flame, ArrowRight, Share2, Camera } from 'lucide-react';
import { getStoredCurrentUser, getStoredMatches, getStoredUsers, enterArenaMatchmaking, saveCurrentUser } from '@/lib/storage';
import { Match, UserProfile } from '@/lib/types';
import MatchResultModal from '@/components/MatchResultModal';
import ShareCardModal from '@/components/ShareCardModal';
import CameraCaptureModal from '@/components/CameraCaptureModal';

export default function ArenaPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeArenaMatch, setActiveArenaMatch] = useState<{ match: Match; opponent: UserProfile } | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [error, setError] = useState('');

  const loadData = () => {
    const user = getStoredCurrentUser();
    const matches = getStoredMatches();
    const users = getStoredUsers();

    setCurrentUser(user);

    // Check if user has an active pending match waiting for votes
    const pendingMatch = matches.find(
      (m) =>
        (m.playerAId === user.id || m.playerBId === user.id) &&
        m.status === 'WAITING_FOR_VOTES'
    );

    if (pendingMatch) {
      const oppId = pendingMatch.playerAId === user.id ? pendingMatch.playerBId : pendingMatch.playerAId;
      const opp = users.find((u) => u.id === oppId);
      if (opp) {
        setActiveArenaMatch({ match: pendingMatch, opponent: opp });
      }
    } else {
      setActiveArenaMatch(null);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Instant Matchmaking Start (Under 300ms)
  const handleStartMatchmaking = () => {
    if (!currentUser) return;
    if (currentUser.battleCredits < 1) {
      setError('You need 1 Battle Credit! Cast 3 votes in the Judge Arena to unlock.');
      return;
    }
    setError('');
    setIsSearching(true);

    setTimeout(() => {
      try {
        const result = enterArenaMatchmaking(currentUser.id);
        setActiveArenaMatch(result);
        setCurrentUser(getStoredCurrentUser());
        setIsSearching(false);
      } catch (err: any) {
        setError(err.message || 'Matchmaking error.');
        setIsSearching(false);
      }
    }, 300);
  };

  // Optional: User snaps a fresh photo before battle
  const handlePhotoConfirmed = (photoDataUrl: string) => {
    if (!currentUser) return;
    setShowCameraModal(false);

    // Update profile picture
    const updatedUser = {
      ...currentUser,
      avatarUrl: photoDataUrl,
    };
    saveCurrentUser(updatedUser);
    setCurrentUser(updatedUser);

    // Immediately start matchmaking
    handleStartMatchmaking();
  };

  const handleSimulateVoteReceived = () => {
    if (!activeArenaMatch) return;
    const matches = getStoredMatches();
    const current = matches.find((m) => m.id === activeArenaMatch.match.id);
    if (!current) return;

    if (Math.random() > 0.4) {
      current.votesA += 1;
    } else {
      current.votesB += 1;
    }
    current.totalVotes += 1;

    if (current.totalVotes >= 5) {
      current.status = 'COMPLETED';
      current.winnerId = current.votesA >= current.votesB ? current.playerAId : current.playerBId;
      setShowResultModal(true);
    }

    localStorage.setItem('faceoff_matches_v1', JSON.stringify(matches));
    loadData();
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Optional Selfie Camera Modal */}
      <CameraCaptureModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onPhotoConfirmed={handlePhotoConfirmed}
      />

      <MatchResultModal
        isOpen={showResultModal}
        match={activeArenaMatch?.match || ({} as Match)}
        user={currentUser}
        opponent={activeArenaMatch?.opponent || ({} as UserProfile)}
        onClose={() => {
          setShowResultModal(false);
          loadData();
        }}
        onShare={() => {
          setShowResultModal(false);
          setShowShareModal(true);
        }}
      />

      <ShareCardModal
        isOpen={showShareModal}
        user={currentUser}
        onClose={() => setShowShareModal(false)}
      />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-arena-accent/10 border border-arena-accent/30 text-arena-accent text-xs font-bold uppercase tracking-widest mb-3">
          <Swords className="w-4 h-4" />
          <span>HEAD-TO-HEAD BATTLE ARENA</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          ⚔️ ENTER THE ARENA
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Compete against players matched near your rating. 5 community votes decide the winner.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-bold flex items-center justify-center space-x-2">
          <ShieldAlert className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Battle Credit Status */}
      <div className="mb-8 p-6 rounded-3xl bg-arena-card border border-arena-border flex items-center justify-between shadow-xl">
        <div>
          <span className="text-xs text-zinc-400 block font-semibold uppercase tracking-wider">
            AVAILABLE BATTLE CREDITS
          </span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
            🔓 {currentUser.battleCredits} Token(s) Available
          </div>
        </div>

        {currentUser.battleCredits === 0 ? (
          <Link
            href="/judge"
            className="px-5 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 font-bold text-xs uppercase tracking-wider flex items-center space-x-2"
          >
            <Gavel className="w-4 h-4" />
            <span>Vote 3x to Unlock</span>
          </Link>
        ) : (
          <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            READY FOR MATCH
          </span>
        )}
      </div>

      {/* Active Battle View OR Matchmaking Search */}
      {isSearching ? (
        <div className="p-12 rounded-3xl bg-arena-card border border-arena-accent/40 text-center shadow-2xl box-glow-accent">
          <Loader2 className="w-12 h-12 text-arena-accent mx-auto animate-spin mb-4" />
          <h2 className="text-2xl font-black text-white">MATCHING OPPONENT...</h2>
        </div>
      ) : activeArenaMatch ? (
        /* Active Match Dashboard */
        <div className="p-6 sm:p-8 rounded-3xl bg-arena-card border border-arena-border shadow-2xl">
          <div className="text-center mb-6">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest">
              BATTLE IN PROGRESS
            </span>
            <h2 className="text-2xl font-black text-white mt-2">WAITING FOR COMMUNITY VOTES</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Match progress: <strong className="text-white">{activeArenaMatch.match.totalVotes} / 5 Votes</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
            {/* You */}
            <div className="p-4 rounded-2xl bg-arena-bg border border-arena-accent/50 text-center">
              <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden ring-2 ring-arena-accent mb-3">
                <img src={currentUser.avatarUrl} alt={currentUser.username} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-black text-white">{currentUser.username} (YOU)</h3>
              <p className="text-xs text-arena-gold font-mono font-bold mt-1">{currentUser.rating} Elo</p>
              <div className="mt-3 text-xl font-black text-arena-accent">
                {activeArenaMatch.match.votesA} Votes
              </div>
            </div>

            {/* Opponent */}
            <div className="p-4 rounded-2xl bg-arena-bg border border-zinc-700 text-center">
              <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden ring-2 ring-zinc-700 mb-3">
                <img src={activeArenaMatch.opponent.avatarUrl} alt={activeArenaMatch.opponent.username} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-black text-white">{activeArenaMatch.opponent.username}</h3>
              <p className="text-xs text-arena-gold font-mono font-bold mt-1">{activeArenaMatch.opponent.rating} Elo</p>
              <div className="mt-3 text-xl font-black text-zinc-400">
                {activeArenaMatch.match.votesB} Votes
              </div>
            </div>
          </div>

          {/* Simulate Vote Received Button for Testing */}
          <div className="pt-4 border-t border-arena-border text-center">
            <button
              onClick={handleSimulateVoteReceived}
              className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs border border-zinc-700"
            >
              ⚡ Receive Simulated Judge Vote ({activeArenaMatch.match.totalVotes}/5)
            </button>
          </div>
        </div>
      ) : (
        /* Empty State / Start Battle Card */
        <div className="p-8 sm:p-12 rounded-3xl bg-arena-card border border-arena-border text-center shadow-xl">
          <Swords className="w-16 h-16 text-arena-accent mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white">READY FOR BATTLE</h2>
          <p className="text-sm text-zinc-400 mt-2 max-w-md mx-auto">
            Use 1 Battle Credit to enter matchmaking using your profile photo.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleStartMatchmaking}
              disabled={currentUser.battleCredits < 1}
              className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl transition-all ${
                currentUser.battleCredits >= 1
                  ? 'bg-gradient-to-r from-arena-accent via-red-600 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white transform hover:scale-105 shadow-arena-accent/20'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
              }`}
            >
              ⚔️ START ARENA MATCHMAKING (-1 CREDIT)
            </button>

            <button
              onClick={() => setShowCameraModal(true)}
              disabled={currentUser.battleCredits < 1}
              className="px-5 py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs flex items-center justify-center space-x-1.5 border border-zinc-700"
            >
              <Camera className="w-4 h-4 text-arena-accent" />
              <span>📸 Update Selfie First</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
