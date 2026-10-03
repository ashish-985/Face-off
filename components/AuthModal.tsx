'use client';

import React, { useState } from 'react';
import { User, Lock, Camera, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { saveCurrentUser, getStoredCurrentUser, getStoredUsers, generateInitialAvatar } from '@/lib/storage';
import { signInWithGoogle } from '@/lib/auth';
import { UserProfile } from '@/lib/types';
import CameraCapture from './CameraCapture';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_AVATARS = [
  generateInitialAvatar('A', 0),
  generateInitialAvatar('S', 1),
  generateInitialAvatar('R', 2),
  generateInitialAvatar('M', 3),
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

  const handleGoogleAuth = () => {
    try {
      signInWithGoogle();
      const demoGoogleUser: UserProfile = {
        id: `google_user_${Date.now()}`,
        username: 'Google_User',
        avatarUrl: generateInitialAvatar('G', 0),
        bio: 'Google Authenticated Player 🚀',
        rating: 1200,
        provisionalMatches: 0,
        wins: 0,
        losses: 0,
        streak: 0,
        maxStreak: 0,
        battleCredits: 2, // Bonus 2 credits for Google Sign-In
        pendingVotesCount: 0,
        totalVotesCast: 0,
        judgeAgreements: 0,
        playerXp: 50,
        judgeXp: 0,
        visibility: 'PUBLIC',
        isAgeVerified: true,
        createdAt: new Date().toISOString(),
        badges: ['first_victory'],
      };
      saveCurrentUser(demoGoogleUser);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError('Google Sign-In failed. Try username login.');
    }
  };

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
      const users = getStoredUsers();
      const existing = users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
      if (existing) {
        saveCurrentUser(existing);
      } else {
        const current = getStoredCurrentUser();
        current.username = username.trim();
        saveCurrentUser(current);
      }
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

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-sm flex items-center justify-center space-x-3 shadow-md transition-all mb-4 transform active:scale-98"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-arena-border"></div>
          </div>
          <span className="relative px-3 bg-arena-card text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
            OR USERNAME LOGIN
          </span>
        </div>

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
                    {showCamera ? 'Use Preset Avatars' : '📸 Open Live Camera'}
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
