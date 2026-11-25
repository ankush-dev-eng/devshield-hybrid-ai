import React from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Lock, 
  CloudUpload, 
  RotateCcw, 
  FileCode, 
  Sparkles 
} from 'lucide-react';
import { SAMPLE_CODES, type CodeSample } from '../data/sampleCode';

interface EditorPaneProps {
  code: string;
  language: string;
  onChange: (value: string) => void;
  onLanguageChange: (lang: string) => void;
  onSelectSample: (sample: CodeSample) => void;
  onRunScan: () => void;
  onSanitizeSecrets: () => void;
  onEscalateCloud: () => void;
  onReset: () => void;
  isScanning: boolean;
  hasFindings: boolean;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  code,
  language,
  onChange,
  onLanguageChange,
  onSelectSample,
  onRunScan,
  onSanitizeSecrets,
  onEscalateCloud,
  onReset,
  isScanning,
  hasFindings,
}) => {
  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl overflow-hidden shadow-2xl transition-all">
      {/* Editor Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-950/70 border-b border-white/[0.08] text-xs">
        <div className="flex items-center gap-3">
          {/* Sample Snippet Selector */}
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <select
              onChange={(e) => {
                const sample = SAMPLE_CODES.find(s => s.id === e.target.value);
                if (sample) onSelectSample(sample);
              }}
              defaultValue=""
              className="bg-slate-900/90 text-slate-200 border border-white/[0.1] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500/50 shadow-inner"
            >
              <option value="" disabled>Load Vulnerable Sample...</option>
              {SAMPLE_CODES.map(sample => (
                <option key={sample.id} value={sample.id}>
                  {sample.name}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-slate-900/90 text-slate-300 border border-white/[0.1] rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500/50 shadow-inner font-mono"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Sanitize Locally Button */}
          <button
            onClick={onSanitizeSecrets}
            disabled={!hasFindings}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              hasFindings
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25 shadow-sm'
                : 'text-slate-500 bg-slate-950/40 cursor-not-allowed border border-white/[0.04]'
            }`}
            title="Redact detected secrets and credentials on-device without cloud egress"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Redact Secrets</span>
          </button>

          {/* Cloud Escalation Button */}
          <button
            onClick={onEscalateCloud}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/40 hover:bg-sky-500/25 transition shadow-sm"
            title="Escalate to Cloud Gemini for automated unit test generation and deep refactoring"
          >
            <CloudUpload className="w-3.5 h-3.5 text-sky-400" />
            <span>Cloud Tests</span>
          </button>

          {/* Run Scan Button */}
          <button
            onClick={onRunScan}
            disabled={isScanning}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition shadow-lg ${
              isScanning
                ? 'bg-slate-800 text-slate-400 cursor-wait'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Auditing...' : 'Audit Code'}</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition"
            title="Reset code to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="relative flex-1 min-h-[460px]">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(val) => onChange(val || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            renderLineHighlight: 'all',
            padding: { top: 14, bottom: 14 },
          }}
        />

        {/* Floating Privacy Badge Overlay */}
        <div className="absolute bottom-3 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/[0.08] text-[11px] font-mono text-emerald-400 shadow-xl pointer-events-none">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>DevShield Protected • Zero Egress</span>
        </div>
      </div>
    </div>
  );
};
