import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Check, 
  Filter, 
  Code2 
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
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-bold">CRITICAL</span>;
      case 'HIGH':
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold">HIGH</span>;
      case 'MEDIUM':
        return <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded text-[10px] font-bold">MEDIUM</span>;
      default:
        return <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold">INFO</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <h3 className="font-semibold text-sm text-white">Vulnerability Inspector</h3>
          <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full font-mono">
            {findings.length}
          </span>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as Severity | 'ALL')}
            className="bg-slate-900 text-slate-300 border border-slate-700 rounded-md px-2 py-1 text-xs focus:outline-none"
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
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              <Check className="w-6 h-6" />
            </div>
            <p className="font-semibold text-slate-200 text-sm">No Vulnerabilities Flagged</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Load a vulnerable snippet from the editor or run an audit to scan for credential leaks and injection vectors.
            </p>
          </div>
        ) : (
          filteredFindings.map((finding) => (
            <div
              key={finding.id}
              className="bg-slate-950/70 border border-slate-800/90 hover:border-slate-700/80 rounded-xl p-3.5 transition group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {getSeverityBadge(finding.severity)}
                  {finding.cwe && (
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      {finding.cwe}
                    </span>
                  )}
                  {finding.lineNumber && (
                    <span className="text-[11px] font-mono text-sky-400/80 bg-sky-950/40 border border-sky-800/40 px-1.5 py-0.5 rounded">
                      Line {finding.lineNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <h4 className="text-sm font-semibold text-slate-100 group-hover:text-emerald-300 transition">
                {finding.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {finding.description}
              </p>

              {/* Vulnerable Code Snippet */}
              {finding.codeSnippet && (
                <div className="mt-2.5 bg-slate-900/90 border border-red-900/30 rounded-lg p-2 font-mono text-xs text-red-300 overflow-x-auto">
                  <span className="text-[10px] text-red-400 block mb-1 font-sans uppercase font-bold tracking-wider">
                    Vulnerable Line:
                  </span>
                  <code>{finding.codeSnippet}</code>
                </div>
              )}

              {/* Suggested Fix */}
              {finding.suggestedFix && (
                <div className="mt-2 bg-slate-900/90 border border-emerald-900/30 rounded-lg p-2 font-mono text-xs text-emerald-300 overflow-x-auto">
                  <span className="text-[10px] text-emerald-400 block mb-1 font-sans uppercase font-bold tracking-wider">
                    Recommended Fix:
                  </span>
                  <code>{finding.suggestedFix}</code>
                </div>
              )}

              {/* Action */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Code2 className="w-3 h-3" />
                  Zero-Egress Analysis
                </span>

                <button
                  onClick={() => handleApply(finding)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
                    appliedId === finding.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
                  }`}
                >
                  {appliedId === finding.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Applied!</span>
                    </>
                  ) : (
                    <>
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
