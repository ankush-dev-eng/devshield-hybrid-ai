import React, { useState } from 'react';
import { 
  Cloud, 
  ShieldCheck, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  FileCheck2, 
  Lock 
} from 'lucide-react';
import { generateSecurityUnitTestsCloud } from '../firebase/aiService';

interface CloudModalProps {
  isOpen: boolean;
  onClose: () => void;
  sanitizedCode: string;
  cloudModelName: string;
  redactedCount: number;
}

export const CloudModal: React.FC<CloudModalProps> = ({
  isOpen,
  onClose,
  sanitizedCode,
  cloudModelName,
  redactedCount,
}) => {
  const [loading, setLoading] = useState(false);
  const [testSuite, setTestSuite] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerateTests = async () => {
    setLoading(true);
    try {
      const result = await generateSecurityUnitTestsCloud(sanitizedCode, cloudModelName);
      setTestSuite(result.testSuite);
      setLatency(result.latencyMs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (testSuite) {
      navigator.clipboard.writeText(testSuite);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Cloud Security Escalation</h3>
              <p className="text-xs text-slate-400">
                Powered by Firebase AI Logic — Model: <span className="font-mono text-sky-400">{cloudModelName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Privacy Attestation Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-200">
                Zero-Leakage Guarantee: {redactedCount} Credentials Scrubbed On-Device
              </p>
              <p className="text-slate-300 text-[11px] mt-0.5">
                All production Stripe keys, AWS tokens, and JWT secrets were masked client-side before calling the cloud model. No plaintext credentials touch the network.
              </p>
            </div>
          </div>

          {/* Sanitized Code Preview */}
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Sanitized Code Payload to Transmit:
              </span>
              <span className="font-mono text-[11px]">{sanitizedCode.length} bytes</span>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-300 max-h-40 overflow-y-auto">
              {sanitizedCode}
            </pre>
          </div>

          {/* Cloud Action Trigger */}
          {!testSuite && (
            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-200">Generate Security Regression Unit Tests</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Escalates sanitized code to Cloud Gemini to draft exploit-regression test suites.
                </p>
              </div>
              <button
                onClick={handleGenerateTests}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow-lg shadow-sky-600/20 transition disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4" />
                    <span>Run Cloud Tests</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Generated Test Suite Result */}
          {testSuite && (
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-1.5">
                <span className="font-medium flex items-center gap-1.5 text-sky-400">
                  <Check className="w-3.5 h-3.5" />
                  Generated Test Suite (Round-trip: {latency} ms):
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 transition"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-sky-200 max-h-60 overflow-y-auto">
                {testSuite}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
