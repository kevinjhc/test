import React, { useState } from "react";
import LogoSrc from "@/assets/Logo.svg";
import {
  IconFile,
  IconMessageCircle,
  IconUserPlus,
  IconSettings,
  IconCreditCard,
  IconLogout,
  IconChevronDown,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";

interface TopNavProps {
  activeView?: "home" | "attorney" | "files" | "chat" | "newChat";
  onShowFiles?: () => void;
  onNewChat?: () => void;
  onInvite?: () => void;
  onShowFiles2?: () => void; // billing -> files
}

export function TopNav({
  activeView,
  onShowFiles,
  onNewChat,
  onInvite,
  onShowFiles2,
}: TopNavProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="flex-shrink-0 bg-black z-50 relative">
      {/* Main bar */}
      <div className="h-12 flex items-center px-5 gap-6">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <img src={LogoSrc} alt="Logo" className="h-4 w-auto invert" />
        </div>

        {/* Divider — hidden on mobile */}
        <div className="hidden md:block h-5 w-px bg-white/20" />

        {/* Nav items — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={onShowFiles}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
              activeView === "files"
                ? "bg-white/15 text-white"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <IconFile size={15} />
            Files
          </button>
          <button
            onClick={onNewChat}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
              activeView === "chat" || activeView === "newChat"
                ? "bg-white/15 text-white"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <IconMessageCircle size={15} />
            Chats
          </button>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right actions — hidden on mobile */}
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={onInvite}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <IconUserPlus size={15} />
            Invite
          </button>

          {/* Settings dropdown */}
          <div className="relative">
            <button
              onClick={() => setSettingsOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                settingsOpen
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <IconSettings size={15} />
              Settings
              <IconChevronDown
                size={13}
                className={`transition-transform ${settingsOpen ? "rotate-180" : ""}`}
              />
            </button>

            {settingsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setSettingsOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <IconSettings size={15} className="text-gray-400" />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setSettingsOpen(false);
                      onShowFiles2?.();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <IconCreditCard size={15} className="text-gray-400" />
                    Billing
                  </button>
                  <div className="my-1 h-px bg-gray-100" />
                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <IconLogout size={15} className="text-gray-400" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Hamburger button — visible on mobile only */}
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="md:hidden flex items-center justify-center p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
        </button>
      </div>

      {/* Mobile menu — visible on mobile only when open */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="md:hidden relative z-50 border-t border-white/10 px-3 py-3 flex flex-col gap-1">
            <button
              onClick={() => {
                onShowFiles?.();
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                activeView === "files"
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <IconFile size={15} />
              Files
            </button>
            <button
              onClick={() => {
                onNewChat?.();
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                activeView === "chat" || activeView === "newChat"
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <IconMessageCircle size={15} />
              Chats
            </button>

            <div className="my-1 h-px bg-white/10" />

            <button
              onClick={() => {
                onInvite?.();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <IconUserPlus size={15} />
              Invite
            </button>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <IconSettings size={15} />
              Settings
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onShowFiles2?.();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <IconCreditCard size={15} />
              Billing
            </button>

            <div className="my-1 h-px bg-white/10" />

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <IconLogout size={15} />
              Sign out
            </button>
          </div>
        </>
      )}
    </header>
  );
}

export default TopNav;
