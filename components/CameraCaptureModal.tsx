'use client';

import React from 'react';
import { Camera, X, Sparkles } from 'lucide-react';
import CameraCapture from './CameraCapture';
import { stopAllWebcamHardware } from '@/lib/cameraManager';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoConfirmed: (photoDataUrl: string) => void;
}

export default function CameraCaptureModal({
  isOpen,
  onClose,
  onPhotoConfirmed,
}: CameraCaptureModalProps) {
  if (!isOpen) return null;

  const handleCloseModal = () => {
    stopAllWebcamHardware();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg bg-arena-card border border-arena-accent/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center box-glow-accent">
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-arena-accent/10 border border-arena-accent/30 text-arena-accent font-black text-xs uppercase tracking-widest mb-3">
          <Sparkles className="w-4 h-4" />
          <span>ARENA ENTRY REQ</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white">
          📸 SNAP LIVE ARENA PHOTO
        </h2>
        <p className="text-xs text-zinc-300 mt-1 mb-6">
          Take a live selfie to enter this battle. Camera turns off automatically once captured!
        </p>

        <CameraCapture
          onCapture={(imageDataUrl) => {
            stopAllWebcamHardware();
            onPhotoConfirmed(imageDataUrl);
          }}
          onCancel={handleCloseModal}
        />
      </div>
    </div>
  );
}
