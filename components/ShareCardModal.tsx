'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Share2, Flame, Trophy, Swords } from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface ShareCardModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
}

export default function ShareCardModal({ isOpen, user, onClose }: ShareCardModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `⚔️ FACE-OFF ARENA RESULT\n\n👤 ${user.username}\n🏆 Rating: ${user.rating} Elo\n🔥 Win Streak: ${user.streak}\n⚔️ Battles: ${user.wins + user.losses} (${user.wins} Wins)\n\nCan you beat my rating? Challenge me now on FACE-OFF! 😎`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-sm bg-arena-card border border-arena-border rounded-3xl p-6 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Share Card Content Preview */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-arena-card via-zinc-900 to-arena-bg border border-arena-accent/40 box-glow-accent text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden ring-4 ring-arena-accent mb-3">
            <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
          </div>

          <span className="px-3 py-1 rounded-full bg-arena-accent/10 border border-arena-accent/30 text-arena-accent font-black text-[10px] tracking-widest uppercase inline-block mb-1">
            FACE-OFF CONTENDER
          </span>

          <h3 className="text-2xl font-black text-white">{user.username}</h3>
          
          <div className="flex items-center justify-center space-x-2 my-2 text-arena-gold font-extrabold text-lg">
            <Trophy className="w-5 h-5" />
            <span>{user.rating} Elo</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs my-3 text-zinc-300">
            <div className="p-2 rounded-xl bg-arena-bg/60 border border-arena-border">
              <span className="text-[10px] text-zinc-500 block">Win Streak</span>
              <span className="font-bold text-amber-400">🔥 {user.streak} Wins</span>
            </div>
            <div className="p-2 rounded-xl bg-arena-bg/60 border border-arena-border">
              <span className="text-[10px] text-zinc-500 block">Record</span>
              <span className="font-bold text-emerald-400">{user.wins}W - {user.losses}L</span>
            </div>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-arena-accent to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>CARD COPIED TO CLIPBOARD!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>COPY SHARE CARD</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
