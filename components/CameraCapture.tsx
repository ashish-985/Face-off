'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle2, AlertCircle, VideoOff } from 'lucide-react';
import { registerActiveStream, stopAllWebcamHardware } from '@/lib/cameraManager';

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onCancel?: () => void;
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Start camera hardware stream
  const startCamera = async () => {
    stopAllWebcamHardware(); // Stop any existing hardware session first
    setIsLoading(true);
    setError('');
    setCapturedImage(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam access is not supported by your browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 400 },
          height: { ideal: 400 },
        },
        audio: false,
      });

      registerActiveStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setError(
        err.message ||
          'Unable to access webcam. Please check browser permissions.'
      );
      setIsLoading(false);
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      // MASTER CLEANUP ON UNMOUNT: Shut down all webcam hardware
      stopAllWebcamHardware();
    };
  }, []);

  // Snap photo & execute MASTER HARDWARE SHUTDOWN
  const takeSnap = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const size = Math.min(video.videoWidth || 400, video.videoHeight || 400);
    canvas.width = size;
    canvas.height = size;

    const startX = ((video.videoWidth || size) - size) / 2;
    const startY = ((video.videoHeight || size) - size) / 2;

    // Mirror image for realistic selfie feel
    ctx.translate(size, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(dataUrl);

    // KILL WEBCAM HARDWARE IMMEDIATELY
    stopAllWebcamHardware();
  };

  const handleRetake = () => {
    startCamera();
  };

  const handleConfirm = () => {
    stopAllWebcamHardware();
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const handleClose = () => {
    stopAllWebcamHardware();
    if (onCancel) onCancel();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <canvas ref={canvasRef} className="hidden" />

      {error ? (
        <div className="w-full p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-center text-xs text-red-400 space-y-2">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="font-semibold">{error}</p>
          <div className="flex justify-center space-x-2">
            <button
              onClick={startCamera}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
            >
              Retry Camera
            </button>
            {onCancel && (
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-xs"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : capturedImage ? (
        /* Photo Preview State - Camera Hardware is 100% KILLED */
        <div className="flex flex-col items-center space-y-3">
          <div className="relative w-56 h-56 rounded-2xl overflow-hidden ring-4 ring-emerald-500 shadow-2xl">
            <img
              src={capturedImage}
              alt="Selfie Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-black font-extrabold text-[10px]">
              CAMERA OFF • PHOTO READY
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRetake}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake Photo</span>
            </button>

            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase tracking-wider flex items-center space-x-1 shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Use This Selfie</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Live Camera Viewfinder */
        <div className="flex flex-col items-center space-y-3">
          <div className="relative w-56 h-56 rounded-2xl overflow-hidden bg-black ring-2 ring-arena-accent shadow-2xl">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-xs text-zinc-400 font-semibold">
                Turning on camera...
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover -scale-x-100"
            />

            {/* Face Alignment Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-40 h-48 rounded-full border-2 border-dashed border-arena-accent/70 bg-arena-accent/5 flex items-end justify-center pb-2">
                <span className="text-[10px] font-bold text-arena-accent bg-black/60 px-2 py-0.5 rounded-full">
                  CENTER FACE
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={takeSnap}
              disabled={isLoading || !isCameraActive}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-arena-accent via-red-600 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 transform active:scale-95 disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
              <span>📸 SNAP PHOTO NOW</span>
            </button>

            <button
              onClick={handleClose}
              className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
              title="Turn Off Camera"
            >
              <VideoOff className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
