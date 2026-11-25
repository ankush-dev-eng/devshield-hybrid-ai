import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Check, 
  Filter, 
  Wrench,
  CheckCircle2,
  Lock
} from 'lucide-react';
import type { SecurityFinding, Severity } from '../types/security';

interface FindingsPanelProps {
  findings: SecurityFinding[];
  onApplyFix: (finding: SecurityFinding) => void;
  onHighlightLine?: (lineNumber: number) => void;
}

export const FindingsPanel: React.FC<FindingsPanelProps> = ({
  findings,
  onApplyFix,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'ALL'>('ALL');
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const filteredFindings = filterSeverity === 'ALL'
    ? findings
    : findings.filter(f => f.severity === filterSeverity);

  const handleApply = (finding: SecurityFinding) => {
    onApplyFix(finding);
    setAppliedId(finding.id);
    setTimeout(() => setAppliedId(null), 2500);
  };

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold tracking-wider">
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold tracking-wider">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="bg-sky-500/20 text-sky-400 border border-sky-500/40 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold tracking-wider">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold tracking-wider">
            INFO
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl overflow-hidden shadow-2xl transition-all">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950/70 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <h3 className="font-display font-bold text-sm text-white">Vulnerability Inspector</h3>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-2 py-0.5 rounded-full font-mono font-semibold">
            {findings.length}
          </span>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as Severity | 'ALL')}
            className="bg-slate-900/90 text-slate-300 border border-white/[0.1] rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500/50 shadow-inner"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MEDIUM">Medium Only</option>
          </select>
        </div>
      </div>

      {/* Findings List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {filteredFindings.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
              <Check className="w-7 h-7" />
            </div>
            <p className="font-display font-bold text-slate-100 text-base">No Vulnerabilities Flagged</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              Code is verified clean. Load another sample snippet or write code with Live Guard active to audit on-device.
            </p>
          </div>
        ) : (
          filteredFindings.map((finding) => (
            <div
              key={finding.id}
              className={`relative bg-slate-950/60 border rounded-xl p-4 transition-all group overflow-hidden ${
                finding.severity === 'CRITICAL'
                  ? 'border-rose-500/30 hover:border-rose-500/60'
                  : finding.severity === 'HIGH'
                  ? 'border-amber-500/30 hover:border-amber-500/60'
                  : 'border-sky-500/30 hover:border-sky-500/60'
              }`}
            >
              {/* Left Color Accent Bar */}
              <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                finding.severity === 'CRITICAL'
                  ? 'bg-rose-500'
                  : finding.severity === 'HIGH'
                  ? 'bg-amber-500'
                  : 'bg-sky-500'
              }`} />

              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2 pl-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {getSeverityBadge(finding.severity)}
                  {finding.cwe && (
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-md border border-white/[0.06]">
                      {finding.cwe}
                    </span>
                  )}
                  {finding.lineNumber && (
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-md border border-white/[0.06]">
                      Line {finding.lineNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div className="pl-1">
                <h4 className="font-semibold text-sm text-slate-100 group-hover:text-white transition">
                  {finding.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {finding.description}
                </p>
              </div>

              {/* Vulnerable Line Highlight */}
              {finding.codeSnippet && (
                <div className="mt-2.5 pl-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-rose-400 mb-1 flex items-center gap-1">
                    <span>Vulnerable Line:</span>
                  </div>
                  <pre className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/25 text-[11px] font-mono text-rose-200 overflow-x-auto">
                    <code>{finding.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Recommended Fix */}
              {finding.suggestedFix && (
                <div className="mt-2.5 pl-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1">
                    <span>Recommended Fix:</span>
                  </div>
                  <pre className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/25 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                    <code>{finding.suggestedFix}</code>
                  </pre>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between pl-1">
                <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  Zero-Egress Analysis
                </span>

                <button
                  onClick={() => handleApply(finding)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition ${
                    appliedId === finding.id
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/25'
                  }`}
                >
                  {appliedId === finding.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Applied!</span>
                    </>
                  ) : (
                    <>
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Apply Fix</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
