import React, { useState } from 'react';

interface NavbarProps {
  currentView: 'organizer' | 'attendee';
  onViewChange: (view: 'organizer' | 'attendee') => void;
  totalPosts: number;
  onOpenHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  totalPosts,
  onOpenHelp,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest border-b border-outline-variant shadow-xs">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onViewChange('organizer')}
            className="flex items-center gap-2 focus:outline-none text-left cursor-pointer group"
          >
            <img
              alt="EventPulse Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XwXGP4ZcmSJIC_FV6uVjKA_56ND9-5NaVJS0zvE960O-LhZnwWTiwzD2r4wfIkQgXFxKkn-2GwkMb9Yp33pYXJiX0G2SmWya-XrONnvDHmGkssHKM3k2NQHI27Wg9mffAtutTguQ2YffDW6_HIue63CC-K1qW9I0OBiUinuwO4vYcDMYZq_G4_-sREpsTt1xKylMLl0NuDaUOVrJUdxd6CeiW7S3pJ2p8Jtx6-xEFY-2isfRzH7SNMNYs0"
            />
            <span className="font-semibold text-lg text-on-surface tracking-tight">EventPulse</span>
          </button>
          <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface-container text-xs font-semibold text-primary tracking-wide border border-outline-variant/40">
            AI Post Studio
          </span>
        </div>

        {/* Center: View Mode Toggle */}
        <nav
          className="flex items-center p-1 bg-surface-container-low rounded-xl border border-outline-variant shadow-xs"
          aria-label="View Switcher"
        >
          <button
            onClick={() => onViewChange('organizer')}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
              currentView === 'organizer'
                ? 'bg-primary-container text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Organizer
          </button>
          <button
            onClick={() => onViewChange('attendee')}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
              currentView === 'attendee'
                ? 'bg-primary-container text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Attendee View
          </button>
        </nav>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-3">
          {/* Post Generation Counter */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed text-xs font-medium border border-outline-variant/30">
            <span className="material-symbols-outlined text-[18px] text-primary-container">auto_awesome</span>
            <span>{totalPosts.toLocaleString()} Posts Generated</span>
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors focus:outline-none cursor-pointer relative"
              title="Notifications"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-container"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-3 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60">
                  <span className="font-semibold text-sm text-on-surface">Notifications</span>
                  <span className="text-[11px] text-primary font-medium">Mark all read</span>
                </div>
                <div className="space-y-2.5 pt-2 text-xs">
                  <div className="p-2 rounded-lg bg-surface-container-low flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-tertiary-container mt-1 shrink-0"></span>
                    <div>
                      <p className="font-medium text-on-surface">Reach milestone surpassed!</p>
                      <p className="text-on-surface-variant text-[11px]">342.5K estimated impressions tracked on LinkedIn.</p>
                      <span className="text-[10px] text-outline">5m ago</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-container-low flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-container mt-1 shrink-0"></span>
                    <div>
                      <p className="font-medium text-on-surface">New keynote quote trending</p>
                      <p className="text-on-surface-variant text-[11px]">Sam Altmeyer&apos;s quote included in 84 attendee drafts.</p>
                      <span className="text-[10px] text-outline">18m ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors focus:outline-none cursor-pointer"
            title="Help Guide"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
          </button>

          {/* User Profile */}
          <div className="relative flex items-center pl-2 border-l border-outline-variant">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 rounded-full focus:outline-none group cursor-pointer"
              type="button"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant group-hover:ring-primary-container transition-all"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoLsrktSfLLGRW7aBvaJ1CfZuGQvcxsa8_7Ebucezp4UpV9oF0strCoapDMn6Q5zthongC21EGEKjwBHXUjugu6PYFnnx-6UP9tKIJLcqUq91aUZNuo6rEqby2kFTYABCCH0z2Nly1LSHdMyz1X41r-0U6-4a0D6SUv-JkaN7H8Dp_xCL_C-3i1KezPY-YmLcO4ZyzsuuU_8iBIv2O6z-gEteqm1uAQlVBZ8PUC1H0MtQGNB-On8NyQw"
              />
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-on-surface">
                expand_more
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-10 mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-2 z-50">
                <div className="px-3 py-2 border-b border-outline-variant/60">
                  <p className="font-semibold text-sm text-on-surface">Sarah Jenkins</p>
                  <p className="text-xs text-on-surface-variant truncate">sarah.j@datamesh.ai</p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[10px] font-semibold">
                    Conference Host
                  </span>
                </div>
                <div className="pt-1 text-xs">
                  <button
                    onClick={() => {
                      onViewChange('organizer');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-container flex items-center gap-2 text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[16px]">dashboard</span>
                    Organizer Control Center
                  </button>
                  <button
                    onClick={() => {
                      onViewChange('attendee');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-container flex items-center gap-2 text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit_note</span>
                    Attendee Post Studio
                  </button>
                  <button
                    onClick={onOpenHelp}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-container flex items-center gap-2 text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[16px]">help</span>
                    Platform Guide
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
