'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, UserX, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
        <div className="flex items-center space-x-3 text-arena-accent mb-4">
          <ShieldCheck className="w-8 h-8" />
          <h1 className="text-3xl font-black text-white">PRIVACY POLICY (18+ ONLY)</h1>
        </div>
        <p className="text-xs text-zinc-400 mb-8 border-b border-arena-border/60 pb-4">
          Last Updated: October 2026 • Strict Privacy & Facial Photo Protection Policy
        </p>

        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span>1. Zero Public PII Disclosure Rule</span>
            </h2>
            <p>
              Because FACE-OFF is centered around photo competition, privacy is enforced as a core product feature.
              <strong> FACE-OFF never publicly displays or exposes your real full name, email address, phone number, exact physical location, IP address, or private account credentials.</strong>
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <EyeOff className="w-5 h-5 text-cyan-400" />
              <span>2. Profile Visibility & Photo Usage</span>
            </h2>
            <p>
              Users maintain full control over profile visibility:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-400">
              <li><strong>Public:</strong> Profile and uploaded selfie photos appear in head-to-head arena battles and public leaderboards.</li>
              <li><strong>Match Only:</strong> Profile photo appears strictly during active arena matches.</li>
              <li><strong>Hidden:</strong> Profile is hidden and suspended from appearing in voting queues.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <UserX className="w-5 h-5 text-arena-accent" />
              <span>3. Data Deletion & Photo Removal Rights</span>
            </h2>
            <p>
              You hold full ownership over your account data. You may delete your uploaded selfie photos or permanently delete your account at any time directly from the <strong>Profile Settings</strong> tab.
              Upon deletion, all stored photos, ratings, and match records associated with your account are permanently purged.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. 18+ Age Assurance & Declaration</h2>
            <p className="text-xs text-zinc-400">
              FACE-OFF is strictly intended for individuals 18 years of age or older. We enforce age declarations upon entry and ban accounts found to belong to minors immediately.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
