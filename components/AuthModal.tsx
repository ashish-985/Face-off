'use client';

import React, { useState } from 'react';
import { User, Lock, Camera, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { saveCurrentUser, getStoredCurrentUser } from '@/lib/storage';
import { UserProfile } from '@/lib/types';
import CameraCapture from './CameraCapture';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
];

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATARS[0]);
  const [bio, setBio] = useState('');
  const [confirmedAge, setConfirmedAge] = useState(true);
  const [error, setError] = useState('');
  const [showCamera, setShowCamera] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    if (isSignUp && !confirmedAge) {
      setError('You must confirm you are 18+');
      return;
    }

    if (isSignUp) {
      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        username: username.trim(),
        avatarUrl,
        bio: bio || 'Arena contender ⚔️',
        rating: 1000,
        provisionalMatches: 0,
        wins: 0,
        losses: 0,
        streak: 0,
        maxStreak: 0,
        battleCredits: 1, // Bonus 1 credit to start
        pendingVotesCount: 0,
        totalVotesCast: 0,
        judgeAgreements: 0,
        playerXp: 25,
        judgeXp: 0,
        visibility: 'PUBLIC',
        isAgeVerified: true,
        createdAt: new Date().toISOString(),
        badges: [],
      };
      saveCurrentUser(newUser);
    } else {
      const current = getStoredCurrentUser();
      current.username = username.trim();
      saveCurrentUser(current);
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-arena-card border border-arena-border rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-white">
            {isSignUp ? '⚔️ Create Arena Profile' : '🔓 Welcome Back'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {isSignUp
              ? 'Join head-to-head battles and judge matches'
              : 'Sign in to access your battle stats'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Ashish_V"
                className="w-full bg-arena-bg border border-arena-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-arena-accent"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-arena-bg border border-arena-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-arena-accent"
                required
              />
            </div>
          </div>

          {isSignUp && (
            <>
              {/* Profile Photo Capture Mode */}
              <div className="p-4 rounded-xl bg-arena-bg border border-arena-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white flex items-center space-x-1">
                    <Camera className="w-4 h-4 text-arena-accent" />
                    <span>Profile Photo (Live Camera Selfie)</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setShowCamera(!showCamera)}
                    className="text-xs text-cyan-400 hover:underline font-bold"
                  >
                    {showCamera ? 'Use Demo Preset' : '📸 Open Live Camera'}
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
                      <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-arena-accent shrink-0">
                        <img src={avatarUrl} alt="Selected photo" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-zinc-400">
                        Selected profile picture preview
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {DEFAULT_AVATARS.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatarUrl(url)}
                          className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-transform ${
                            avatarUrl === url
                              ? 'border-arena-accent scale-105 shadow-md shadow-arena-accent/30'
                              : 'border-arena-border opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={url} alt="avatar" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Short Bio (Optional)
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Ready for head-to-head battles!"
                  className="w-full bg-arena-bg border border-arena-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-arena-accent"
                />
              </div>

              {/* Age confirmation checkbox */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="ageCheck"
                  checked={confirmedAge}
                  onChange={(e) => setConfirmedAge(e.target.checked)}
                  className="w-4 h-4 rounded border-arena-border bg-arena-bg text-arena-accent focus:ring-0"
                />
                <label htmlFor="ageCheck" className="text-xs text-zinc-300">
                  I confirm that I am 18 years of age or older 🔞
                </label>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-arena-accent to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-sm shadow-lg shadow-arena-accent/20 transition-all mt-4"
          >
            {isSignUp ? 'ENTER ARENA & COMPETE' : 'SIGN IN'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
