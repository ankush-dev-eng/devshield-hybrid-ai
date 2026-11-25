import React from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Cloud, 
  Key, 
  Settings, 
  HelpCircle, 
  CheckCircle2, 
  Lock, 
  GitCompare, 
  FileText, 
  Zap 
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
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-3.5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-bold">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">DevShield</span>
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Hybrid AI
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Zero-Egress On-Device Security with Cloud Gemini Escalation
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Guard Toggle */}
          <button
            onClick={onToggleLiveGuard}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isLiveGuardActive
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Real-time as-you-type on-device security audit"
          >
            <Zap className={`w-3.5 h-3.5 ${isLiveGuardActive ? 'text-emerald-400 fill-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>Live Guard: {isLiveGuardActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Inference Mode Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => onInferenceModeChange('prefer_on_device')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                inferenceMode === 'prefer_on_device'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Automatically uses Gemini Nano on-device when available, falls back to Cloud"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>⚡ Prefer On-Device</span>
            </button>

            <button
              onClick={() => onInferenceModeChange('only_on_device')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                inferenceMode === 'only_on_device'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Strict Zero-Egress: Only runs locally on Gemini Nano"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Only Local</span>
            </button>

            <button
              onClick={() => onInferenceModeChange('only_in_cloud')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                inferenceMode === 'only_in_cloud'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Runs exclusively on Firebase Cloud Gemini"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Cloud Only</span>
            </button>
          </div>

          {/* Compare Diff Button */}
          <button
            onClick={onOpenDiff}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-medium transition"
            title="Inspect side-by-side visual diff of original vs hardened code"
          >
            <GitCompare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Diff</span>
          </button>

          {/* Export Report Button */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-medium transition"
            title="View & export executive compliance security report"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>Report</span>
          </button>

          {/* Firebase System Badges */}
          <div className="hidden xl:flex items-center gap-2 text-xs">
            <span 
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border ${
                appCheckActive 
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60' 
                  : 'bg-amber-950/40 text-amber-300 border-amber-800/60'
              }`}
              title="Firebase App Check attestation token status"
            >
              <Key className="w-3 h-3" />
              App Check
            </span>

            <span 
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border ${
                remoteConfigSynced 
                  ? 'bg-sky-950/40 text-sky-300 border-sky-800/60' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title="Firebase Remote Config dynamic parameter synchronization"
            >
              <CheckCircle2 className="w-3 h-3" />
              Remote Config
            </span>
          </div>

          {/* Modal Triggers */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenGuide}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition"
              title="Hackathon Demo & Verification Checklist"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition"
              title="Firebase Configuration & Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
