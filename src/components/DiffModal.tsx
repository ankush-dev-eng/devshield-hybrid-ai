import React from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { 
  X, 
  GitCompare, 
  ShieldCheck, 
  Check, 
  Copy 
} from 'lucide-react';

interface DiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalCode: string;
  hardenedCode: string;
  language: string;
  onAcceptAllFixes: () => void;
}

export const DiffModal: React.FC<DiffModalProps> = ({
  isOpen,
  onClose,
  originalCode,
  hardenedCode,
  language,
  onAcceptAllFixes,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyHardened = () => {
    navigator.clipboard.writeText(hardenedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyAll = () => {
    onAcceptAllFixes();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Visual Security Diff Inspector</h3>
              <p className="text-xs text-slate-400">
                Left: Original Vulnerable Code • Right: DevShield Hardened Fixes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyHardened}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Hardened Code' : 'Copy Hardened Code'}</span>
            </button>
            <button
              onClick={handleApplyAll}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Apply All Hardened Fixes</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Monaco Diff Editor */}
        <div className="flex-1 w-full bg-slate-950">
          <DiffEditor
            height="100%"
            language={language}
            original={originalCode}
            modified={hardenedCode}
            theme="vs-dark"
            options={{
              fontSize: 13,
              readOnly: true,
              automaticLayout: true,
              renderSideBySide: true,
              wordWrap: 'on',
              fontFamily: "'Fira Code', Menlo, Monaco, 'Courier New', monospace",
            }}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between">
          <span>Zero-Egress AST Diff Generation</span>
          <span>Red lines indicate removed vulnerabilities • Green lines indicate hardened mitigations</span>
        </div>
      </div>
    </div>
  );
};
