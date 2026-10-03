'use client';

import React from 'react';
import { UserX, AlertTriangle, X } from 'lucide-react';
import { saveBlock } from '@/lib/storage';

interface BlockModalProps {
  isOpen: boolean;
  targetUsername: string;
  targetUserId: string;
  blockerId: string;
  onClose: () => void;
  onBlocked: () => void;
}

export default function BlockModal({
  isOpen,
  targetUsername,
  targetUserId,
  blockerId,
  onClose,
  onBlocked,
}: BlockModalProps) {
  if (!isOpen) return null;

  const handleBlock = () => {
    saveBlock({
      id: `block_${Date.now()}`,
      blockerId,
      blockedUserId: targetUserId,
      createdAt: new Date().toISOString(),
    });
    onBlocked();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-sm bg-arena-card border border-arena-border rounded-2xl p-6 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center mb-3">
          <UserX className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">Block {targetUsername}?</h3>
        <p className="text-xs text-zinc-400 mb-6">
          Blocking this user will permanently prevent them from matching with you in the Arena, appearing in your voting queue, or viewing your profile.
        </p>

        <div className="space-y-2">
          <button
            onClick={handleBlock}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg uppercase tracking-wider transition-all"
          >
            CONFIRM BLOCK
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
