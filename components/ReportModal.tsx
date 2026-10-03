'use client';

import React, { useState } from 'react';
import { ShieldAlert, X, CheckCircle2 } from 'lucide-react';
import { ReportReason } from '@/lib/types';
import { saveReport } from '@/lib/storage';

interface ReportModalProps {
  isOpen: boolean;
  targetUsername: string;
  targetUserId: string;
  reporterId: string;
  onClose: () => void;
}

const REPORT_REASONS: { key: ReportReason; label: string }[] = [
  { key: 'UNDERAGE', label: '🔞 Underage Concern' },
  { key: 'NUDITY', label: '🚫 Nudity / Sexual Content' },
  { key: 'HARASSMENT', label: '⚠️ Harassment or Abuse' },
  { key: 'STOLEN_PHOTO', label: '📸 Fake / Stolen Photo' },
  { key: 'IMPERSONATION', label: '👤 Impersonation' },
  { key: 'HATE_ABUSE', label: '🛑 Hate Symbols or Content' },
  { key: 'SPAM', label: '💬 Spam or Misleading Content' },
  { key: 'OTHER', label: '🔍 Other Violation' },
];

export default function ReportModal({
  isOpen,
  targetUsername,
  targetUserId,
  reporterId,
  onClose,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReason>('UNDERAGE');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveReport({
      id: `report_${Date.now()}`,
      reporterId,
      targetUserId,
      reason: selectedReason,
      details,
      createdAt: new Date().toISOString(),
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-arena-card border border-arena-border rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white">Report Submitted</h3>
            <p className="text-xs text-zinc-400">
              Our safety moderation team will review this report within 24 hours.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2 text-arena-accent mb-4">
              <ShieldAlert className="w-6 h-6" />
              <h2 className="text-xl font-black text-white">Report {targetUsername}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Select Violation Reason
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {REPORT_REASONS.map((r) => (
                    <label
                      key={r.key}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        selectedReason === r.key
                          ? 'border-arena-accent bg-arena-accent/10 text-white font-bold'
                          : 'border-arena-border text-zinc-400 hover:bg-arena-bg'
                      }`}
                    >
                      <span>{r.label}</span>
                      <input
                        type="radio"
                        name="reason"
                        value={r.key}
                        checked={selectedReason === r.key}
                        onChange={() => setSelectedReason(r.key)}
                        className="hidden"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Additional Context (Optional)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide any details to help moderation..."
                  className="w-full bg-arena-bg border border-arena-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-arena-accent h-20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-arena-accent hover:bg-red-600 text-white font-bold text-xs shadow-lg uppercase tracking-wider transition-all"
              >
                SUBMIT REPORT
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
