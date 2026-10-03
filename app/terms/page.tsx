'use client';

import React from 'react';
import Link from 'next/link';
import { AlertOctagon, ShieldAlert, Ban, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center space-x-1 text-xs font-bold text-zinc-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Arena</span>
      </Link>

      <div className="p-6 sm:p-10 rounded-3xl bg-arena-card border border-arena-border shadow-2xl">
        <div className="flex items-center space-x-3 text-amber-400 mb-4">
          <AlertOctagon className="w-8 h-8" />
          <h1 className="text-3xl font-black text-white">TERMS OF SERVICE & STRICT GUIDELINES</h1>
        </div>
        <p className="text-xs text-zinc-400 mb-8 border-b border-arena-border/60 pb-4">
          Strict 18+ Platform Operating Rules • Anti-Harassment & Content Enforcement Policy
        </p>

        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
          {/* Allowed vs Prohibited Photos */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Ban className="w-5 h-5 text-arena-accent" />
              <span>1. Strict Photo Rules & Content Policy</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-xs font-extrabold text-emerald-400 uppercase block mb-2">
                  ✓ ALLOWED CONTENT
                </span>
                <ul className="list-disc pl-4 space-y-1 text-xs text-zinc-300">
                  <li>Normal, appropriate headshots and selfies</li>
                  <li>Photos of yourself taken live via camera</li>
                  <li>Clear, high-quality profile photos</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
                <span className="text-xs font-extrabold text-red-400 uppercase block mb-2">
                  🚫 STRICTLY PROHIBITED (INSTANT BAN)
                </span>
                <ul className="list-disc pl-4 space-y-1 text-xs text-zinc-300">
                  <li>Explicit nudity or sexual content</li>
                  <li>Photos depicting minors under 18</li>
                  <li>Stolen photos or impersonation</li>
                  <li>Hate speech, violent/gore imagery, or harassment</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>2. Anti-Harassment: No Public Comments Policy</span>
            </h2>
            <p>
              To eliminate toxic commentary and appearance harassment, <strong>FACE-OFF strictly disables public comments</strong> across all profiles, matches, and leaderboards. Competition is purely vote-based (Player A vs Player B).
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              <span>3. Anti-Cheat & Leaderboard Integrity</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-400">
              <li><strong>Self-Voting Prohibited:</strong> Contenders cannot vote on their own active matches.</li>
              <li><strong>Duplicate Voting Prevention:</strong> One user receives exactly one vote per match.</li>
              <li><strong>Multi-Account Farming Ban:</strong> Automated rate-limiting and suspicious voting pattern analysis are enforced. Suspicious votes are excluded from Elo calculations.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Account Termination & Reporting</h2>
            <p className="text-xs text-zinc-400">
              Every profile features a 🚨 <strong>Report</strong> button. Profiles reported for underage concerns, nudity, or stolen images are reviewed by safety moderators within 24 hours. Violators are permanently banned and photos purged.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
