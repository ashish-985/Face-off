'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Swords, Gavel, Trophy, User, ShieldCheck, Flame, Lock } from 'lucide-react';
import { getStoredCurrentUser } from '@/lib/storage';
import { UserProfile } from '@/lib/types';
import AuthModal from './AuthModal';

export default function Navbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const u = getStoredCurrentUser();
      setCurrentUser(u);
    };
    loadUser();

    const interval = setInterval(loadUser, 1000);
    return () => clearInterval(interval);
  }, [pathname]);

  if (!currentUser) return null;

  const navItems = [
    {
      label: 'Judge',
      href: '/judge',
      icon: Gavel,
      badge: `${currentUser.pendingVotesCount}/3`,
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    },
    {
      label: 'Arena',
      href: '/arena',
      icon: Swords,
      badge: currentUser.battleCredits > 0 ? `${currentUser.battleCredits} Credit` : 'Locked',
      badgeColor:
        currentUser.battleCredits > 0
          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          : 'bg-zinc-800 text-zinc-400 border-zinc-700',
    },
    {
      label: 'Leaderboard',
      href: '/leaderboard',
      icon: Trophy,
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: User,
    },
  ];

  return (
    <>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setCurrentUser(getStoredCurrentUser())}
      />

      <header className="sticky top-0 z-40 w-full border-b border-arena-border/60 bg-arena-bg/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-arena-accent via-purple-600 to-arena-gold flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider bg-gradient-to-r from-white via-zinc-200 to-arena-accent bg-clip-text text-transparent">
                FACE-OFF
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest block text-arena-accent -mt-1">
                18+ Arena
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all ${
                    isActive
                      ? 'bg-arena-card text-white border border-arena-border shadow-inner'
                      : 'text-zinc-400 hover:text-white hover:bg-arena-card/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-arena-accent' : ''}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Quick Link */}
          <div className="flex items-center space-x-3">
            {currentUser.streak > 0 && (
              <div className="hidden sm:flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                <span>{currentUser.streak} Streak</span>
              </div>
            )}

            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center space-x-2 p-1.5 rounded-xl bg-arena-card border border-arena-border hover:border-arena-accent/50 transition-colors"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.username}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10"
              />
              <div className="text-left hidden lg:block">
                <div className="text-xs font-bold text-white flex items-center space-x-1">
                  <span>{currentUser.username}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-[10px] font-mono text-arena-gold">
                  {currentUser.rating} Elo
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-arena-card/95 border-t border-arena-border backdrop-blur-lg px-2 py-2 flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-semibold ${
                  isActive ? 'text-arena-accent font-bold' : 'text-zinc-400'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>
    </>
  );
}
