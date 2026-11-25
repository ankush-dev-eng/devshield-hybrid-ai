import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Settings, 
  HelpCircle, 
  Lock, 
  GitCompare, 
  FileText, 
  Radio,
  Sliders
} from 'lucide-react';
import type { ActiveInferenceMode } from '../types/security';

interface NavbarProps {
  inferenceMode: ActiveInferenceMode;
  onInferenceModeChange: (mode: ActiveInferenceMode) => void;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
  onOpenDiff: () => void;
  onOpenReport: () => void;
  isLiveGuardActive: boolean;
  onToggleLiveGuard: () => void;
  appCheckActive: boolean;
  remoteConfigSynced: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  inferenceMode,
  onInferenceModeChange,
  onOpenSettings,
  onOpenGuide,
  onOpenDiff,
  onOpenReport,
  isLiveGuardActive,
  onToggleLiveGuard,
  appCheckActive,
  remoteConfigSynced,
}) => {
  return (
    <header className="border-b border-white/[0.08] bg-[#030712]/80 backdrop-blur-2xl px-6 py-3.5 sticky top-0 z-40 transition-colors">
      <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/15 via-cyan-500/15 to-indigo-500/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10 relative group">
            <img 
              src="/devshield-logo.svg" 
              alt="DevShield Logo" 
              className="w-7 h-7 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(93,240,168,0.7)]" 
            />
            <div className="absolute inset-0 rounded-xl bg-emerald-400/10 filter blur-sm -z-10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl text-white tracking-tight">DevShield</span>
              <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 tracking-wider flex items-center gap-1.5">
                <span className="blinking-dot" />
                Hybrid AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Zero-Egress On-Device Security with Firebase Cloud Escalation
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Guard Toggle */}
          <button
            onClick={onToggleLiveGuard}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
              isLiveGuardActive
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900/60 text-slate-400 border-white/[0.06] hover:text-slate-200'
            }`}
            title="Real-time as-you-type on-device security audit"
          >
            <span className={`w-2 h-2 rounded-full ${isLiveGuardActive ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-slate-600'}`} />
            <span>Live Guard: {isLiveGuardActive ? 'ACTIVE' : 'OFF'}</span>
          </button>

          {/* Inference Mode Selector */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-white/[0.08] shadow-inner">
            <button
              onClick={() => onInferenceModeChange('prefer_on_device')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                inferenceMode === 'prefer_on_device'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Automatically uses Gemini Nano on-device when available, falls back to Cloud"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>⚡ Prefer On-Device</span>
            </button>

            <button
              onClick={() => onInferenceModeChange('only_on_device')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                inferenceMode === 'only_on_device'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Forces execution exclusively on Chrome's built-in Gemini Nano"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Only Local</span>
            </button>

            <button
              onClick={() => onInferenceModeChange('only_in_cloud')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                inferenceMode === 'only_in_cloud'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Forces Cloud Gemini execution via Firebase AI Logic"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Cloud Only</span>
            </button>
          </div>

          {/* Quick Tools */}
          <div className="flex items-center gap-1.5 pl-1">
            <button
              onClick={onOpenDiff}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/70 hover:bg-slate-800 text-slate-200 border border-white/[0.08] transition shadow-sm"
              title="Inspect side-by-side AST security diff"
            >
              <GitCompare className="w-3.5 h-3.5 text-sky-400" />
              <span>Diff View</span>
            </button>

            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/70 hover:bg-slate-800 text-slate-200 border border-white/[0.08] transition shadow-sm"
              title="Generate Executive Compliance Report"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Report</span>
            </button>
          </div>

          {/* Status Pills & Config */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium border ${
                appCheckActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                  : 'bg-slate-900 text-slate-500 border-white/[0.06]'
              }`}
              title="Firebase App Check attestation token"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>App Check</span>
            </div>

            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium border ${
                remoteConfigSynced
                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/25'
                  : 'bg-slate-900 text-slate-500 border-white/[0.06]'
              }`}
              title="Firebase Remote Config dynamic parameters synced"
            >
              <Sliders className="w-3 h-3" />
              <span>Remote Config</span>
            </div>

            <button
              onClick={onOpenGuide}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition"
              title="Documentation & Guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSettings}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition"
              title="Settings & Model Parameters"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
