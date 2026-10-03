'use client';

import React, { useState, useEffect } from 'react';
import { getStoredCurrentUser, saveCurrentUser, generateInitialAvatar } from '@/lib/storage';
import { UserProfile, ProfileVisibility } from '@/lib/types';
import { getLevelFromXp } from '@/lib/xp';
import BadgeGrid from '@/components/BadgeGrid';
import ShareCardModal from '@/components/ShareCardModal';
import CameraCapture from '@/components/CameraCapture';
import TierBadge from '@/components/TierBadge';
import { Trophy, Gavel, Flame, ShieldCheck, Eye, Share2, Settings, Trash2, Camera } from 'lucide-react';

const AVATAR_OPTIONS = [
  generateInitialAvatar('A', 0),
  generateInitialAvatar('S', 1),
  generateInitialAvatar('R', 2),
  generateInitialAvatar('M', 3),
];

export default function CurrentProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [visibility, setVisibility] = useState<ProfileVisibility>('PUBLIC');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const u = getStoredCurrentUser();
    setUser(u);
    setBio(u.bio || '');
    setAvatarUrl(u.avatarUrl);
    setVisibility(u.visibility);
  }, []);

  if (!user) return null;

  const playerLevel = getLevelFromXp(user.playerXp);
  const judgeLevel = getLevelFromXp(user.judgeXp);
  const accuracy =
    user.totalVotesCast > 0
      ? Math.round((user.judgeAgreements / user.totalVotesCast) * 100)
      : 71;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      bio,
      avatarUrl,
      visibility,
    };
    saveCurrentUser(updated);
    setUser(updated);
    setIsEditing(false);
    setShowCamera(false);
    setMessage('Profile settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your profile? This cannot be undone.')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ShareCardModal
        isOpen={showShareModal}
        user={user}
        onClose={() => setShowShareModal(false)}
      />

      {message && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
          {message}
        </div>
      )}

      {/* Main Profile Card Header */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-arena-card border border-arena-border shadow-2xl overflow-hidden mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar */}
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-arena-accent shrink-0 box-glow-accent">
            <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
          </div>

          {/* Core Stats Overview */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-3xl font-black text-white flex items-center justify-center sm:justify-start space-x-2">
                  <span>{user.username}</span>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </h1>
                <p className="text-xs text-zinc-400 mt-1">{user.bio}</p>
              </div>

              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs flex items-center space-x-1 border border-zinc-700"
                >
                  <Settings className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="p-2.5 rounded-xl bg-arena-accent hover:bg-red-600 text-white font-bold text-xs flex items-center space-x-1 shadow-md"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Card</span>
                </button>
              </div>
            </div>

            {/* Elo & Level Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
              <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs flex items-center space-x-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Rating: {user.rating} Elo</span>
              </div>

              <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs flex items-center space-x-1">
                <Gavel className="w-3.5 h-3.5" />
                <span>Lvl {playerLevel.level} Player • Lvl {judgeLevel.level} Judge</span>
              </div>

              {user.streak > 0 && (
                <div className="px-3 py-1 rounded-full bg-amber-500 text-black font-extrabold text-xs flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 fill-black" />
                  <span>{user.streak} Win Streak</span>
                </div>
              )}
            </div>

            {/* Animated Tier Rank & Progress Bar */}
            <div className="mt-4 pt-3 border-t border-arena-border/50 text-left">
              <TierBadge elo={user.rating} showProgress={true} size="md" />
            </div>
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-arena-border/60 text-center">
          <div className="p-3 rounded-2xl bg-arena-bg/60 border border-arena-border">
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">⚔️ Battles</span>
            <span className="text-xl font-black text-white">{user.wins + user.losses}</span>
          </div>

          <div className="p-3 rounded-2xl bg-arena-bg/60 border border-arena-border">
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">🟢 Wins / Losses</span>
            <span className="text-xl font-black text-emerald-400">{user.wins}W - {user.losses}L</span>
          </div>

          <div className="p-3 rounded-2xl bg-arena-bg/60 border border-arena-border">
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">⚖️ Votes Cast</span>
            <span className="text-xl font-black text-cyan-400">{user.totalVotesCast}</span>
          </div>

          <div className="p-3 rounded-2xl bg-arena-bg/60 border border-arena-border">
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">🎯 Judge Accuracy</span>
            <span className="text-xl font-black text-amber-400">{accuracy}%</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <div className="p-6 sm:p-8 rounded-3xl bg-arena-card border border-arena-accent/40 shadow-xl mb-8 animate-in fade-in duration-200">
          <h2 className="text-xl font-black text-white mb-4">⚙️ Edit Profile & Live Camera Selfie</h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Bio
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-arena-bg border border-arena-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-arena-accent"
              />
            </div>

            {/* Profile Photo Capture / Selection */}
            <div className="p-4 rounded-2xl bg-arena-bg border border-arena-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white flex items-center space-x-1">
                  <Camera className="w-4 h-4 text-arena-accent" />
                  <span>Profile Photo (Live Camera Capture)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowCamera(!showCamera)}
                  className="text-xs text-cyan-400 hover:underline font-bold"
                >
                  {showCamera ? 'Use Preset Avatars' : '📸 Snap Live Selfie'}
                </button>
              </div>

              {showCamera ? (
                <CameraCapture
                  onCapture={(imageDataUrl) => {
                    setAvatarUrl(imageDataUrl);
                    setShowCamera(false);
                  }}
                />
              ) : (
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-arena-accent shrink-0">
                      <img src={avatarUrl} alt="Selected avatar" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-zinc-400">Current selected profile image</span>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {AVATAR_OPTIONS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatarUrl(url)}
                        className={`relative rounded-xl overflow-hidden aspect-square border-2 ${
                          avatarUrl === url ? 'border-arena-accent ring-2 ring-arena-accent' : 'border-arena-border opacity-50'
                        }`}
                      >
                        <img src={url} alt="avatar" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Profile Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as ProfileVisibility)}
                className="w-full bg-arena-bg border border-arena-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-arena-accent"
              >
                <option value="PUBLIC">Public — Appears in Arena & Leaderboards</option>
                <option value="MATCH_ONLY">Match Only — Limited profile visibility</option>
                <option value="HIDDEN">Hidden — Cannot participate until re-enabled</option>
              </select>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-arena-border">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-2.5 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/30 text-xs font-bold flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-arena-accent text-white font-bold text-xs shadow-lg uppercase tracking-wider"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Badges Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-arena-card border border-arena-border shadow-xl">
        <h2 className="text-xl font-black text-white mb-4">🏆 Unlocked Badges</h2>
        <BadgeGrid unlockedBadgeIds={user.badges} />
      </div>
    </div>
  );
}
