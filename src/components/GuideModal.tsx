import React from 'react';
import { 
  X, 
  Video 
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">3-Minute Video Demo Guide</h3>
              <p className="text-xs text-slate-400">Winning strategy for #BuildHybridAI 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Step 1 */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">1</span>
              <span>The Hook: Why Hybrid AI is Mandatory (0:00 - 0:45)</span>
            </div>
            <p className="text-slate-300 leading-relaxed pl-7">
              Explain that proprietary code, Stripe API keys, and internal database queries cannot be sent to public cloud LLMs. Show the <strong>⚡ Prefer On-Device</strong> badge.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">2</span>
              <span>On-Device Zero-Latency Audit (0:45 - 1:30)</span>
            </div>
            <p className="text-slate-300 leading-relaxed pl-7">
              Select the <em>Node.js Express — Hardcoded Stripe & Raw SQLi</em> sample. Click <strong>⚡ Audit Code</strong>. Highlight the telemetry bar: <span className="text-emerald-400 font-mono">0 Bytes Egressed</span>, sub-second latency, and immediate critical flags for Stripe keys and SQL injection.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">3</span>
              <span>On-Device Secret Sanitization (1:30 - 2:00)</span>
            </div>
            <p className="text-slate-300 leading-relaxed pl-7">
              Click <strong>🔒 Redact Secrets</strong>. Show that the live Stripe key is transformed into <code className="text-amber-300">[REDACTED_STRIPE_LIVE_KEY]</code> on-device before any cloud transmission can occur.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 text-sky-400 font-semibold mb-1">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-xs">4</span>
              <span>Cloud Escalation & Test Generation (2:00 - 2:45)</span>
            </div>
            <p className="text-slate-300 leading-relaxed pl-7">
              Click <strong>☁️ Cloud Tests</strong>. Show the cloud escalation dialog sending <em>only sanitized code</em> to Firebase Cloud Gemini, generating full automated regression test suites.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 text-sky-400 font-semibold mb-1">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-xs">5</span>
              <span>Firebase Architecture Proof (2:45 - 3:00)</span>
            </div>
            <p className="text-slate-300 leading-relaxed pl-7">
              Point to the badges: <strong>Firebase AI Logic</strong> with <code>InferenceMode.PREFER_ON_DEVICE</code>, <strong>App Check</strong> token validation, and <strong>Remote Config</strong> dynamic model updates.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition"
          >
            Got it, Let's Build!
          </button>
        </div>
      </div>
    </div>
  );
};
