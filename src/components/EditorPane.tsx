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
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Editor Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          {/* Sample Snippet Selector */}
          <div className="flex items-center gap-1.5">
            <FileCode className="w-4 h-4 text-sky-400" />
            <select
              onChange={(e) => {
                const sample = SAMPLE_CODES.find(s => s.id === e.target.value);
                if (sample) onSelectSample(sample);
              }}
              defaultValue=""
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-sky-500"
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
            className="bg-slate-900 text-slate-300 border border-slate-700 rounded-lg px-2 py-1 text-xs focus:outline-none"
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              hasFindings
                ? 'bg-amber-600/20 text-amber-300 border border-amber-600/40 hover:bg-amber-600/30'
                : 'text-slate-500 bg-slate-900/50 cursor-not-allowed border border-slate-800'
            }`}
            title="Redact detected secrets and credentials on-device without cloud egress"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Redact Secrets</span>
          </button>

          {/* Cloud Escalation Button */}
          <button
            onClick={onEscalateCloud}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-600/20 text-sky-300 border border-sky-600/40 hover:bg-sky-600/30 transition"
            title="Escalate to Cloud Gemini for automated unit test generation and deep refactoring"
          >
            <CloudUpload className="w-3.5 h-3.5" />
            <span>Cloud Tests</span>
          </button>

          {/* Run Hybrid Scan Button */}
          <button
            onClick={onRunScan}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition disabled:opacity-60"
          >
            {isScanning ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Audit Code</span>
              </>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition"
            title="Reset code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className="flex-1 min-h-[420px]">
        <Editor
          height="100%"
          language={language}
          value={code}
          theme="vs-dark"
          onChange={(val) => onChange(val || '')}
          options={{
            fontSize: 13,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            fontFamily: "'Fira Code', Menlo, Monaco, 'Courier New', monospace",
          }}
        />
      </div>

      {/* Editor Footer Status */}
      <div className="px-4 py-1.5 bg-slate-950 text-[11px] text-slate-500 border-t border-slate-800 flex items-center justify-between">
        <span>Lines: {code.split('\n').length} | Characters: {code.length}</span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Monaco VS Code Editor Engine
        </span>
      </div>
    </div>
  );
};
