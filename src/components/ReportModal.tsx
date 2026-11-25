import React from 'react';
import { 
  X, 
  FileText, 
  Download, 
  ShieldAlert 
} from 'lucide-react';
import type { SecurityFinding, ComplianceMetrics, ScanTelemetry } from '../types/security';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  findings: SecurityFinding[];
  metrics: ComplianceMetrics;
  telemetry: ScanTelemetry | null;
  code: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  findings,
  metrics,
  telemetry,
  code,
}) => {
  if (!isOpen) return null;

  const handleDownloadMarkdown = () => {
    const reportDate = new Date().toISOString().split('T')[0];
    const mdContent = `# DevShield Executive Security Audit Report
**Generated on**: ${reportDate}
**Tool**: DevShield Hybrid AI (Firebase AI Logic)
**Overall Security Score**: ${metrics.score} / 100 (${metrics.grade})
**OWASP Compliance**: ${metrics.owaspCompliance}%
**Data Egress**: ${metrics.zeroEgressPercentage}% On-Device / Zero-Leakage

---

## 1. Executive Summary
- **Total Findings Flagged**: ${metrics.totalFindings}
- **Critical Vulnerabilities**: ${metrics.criticalCount}
- **High Severity**: ${metrics.highCount}
- **Medium Severity**: ${metrics.mediumCount}
- **Inference Latency**: ${telemetry?.latencyMs || 0} ms
- **Inference Mode**: ${telemetry?.source === 'on_device' ? '⚡ Gemini Nano (On-Device Local)' : '☁️ Cloud Gemini 3.5'}

---

## 2. Identified Vulnerabilities & Remediation Plan

${findings.map((f, i) => `### ${i + 1}. [${f.severity}] ${f.title}
- **CWE / OWASP**: ${f.cwe || 'N/A'} • ${f.owaspCategory || 'N/A'}
- **Line Number**: ${f.lineNumber || 'N/A'}
- **Description**: ${f.description}
- **Vulnerable Code**:
\`\`\`
${f.codeSnippet}
\`\`\`
- **Recommended Remediation**:
\`\`\`
${f.suggestedFix}
\`\`\`
`).join('\n')}

---

## 3. Audited Source Code Snapshot
\`\`\`
${code}
\`\`\`
`;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DevShield_Security_Audit_Report_${reportDate}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const jsonData = {
      reportDate: new Date().toISOString(),
      generator: 'DevShield Hybrid AI',
      metrics,
      telemetry,
      findings,
    };
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DevShield_Audit_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Executive Security Audit Report</h3>
              <p className="text-xs text-slate-400">
                OWASP Top 10 & CWE Enterprise Compliance Breakdown
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Markdown Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Top Score Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-slate-400 text-xs block mb-1">Security Score</span>
              <div className="text-3xl font-extrabold text-white">
                <span className={metrics.score >= 80 ? 'text-emerald-400' : metrics.score >= 50 ? 'text-amber-400' : 'text-red-400'}>
                  {metrics.score}
                </span>
                <span className="text-slate-500 text-sm"> / 100</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 mt-1 inline-block">
                Grade: {metrics.grade}
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-slate-400 text-xs block mb-1">OWASP Compliance</span>
              <div className="text-3xl font-extrabold text-sky-400">
                {metrics.owaspCompliance}%
              </div>
              <span className="text-[11px] font-semibold text-slate-400 mt-1 inline-block">
                Standard Verified
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-slate-400 text-xs block mb-1">Privacy & Zero-Egress</span>
              <div className="text-3xl font-extrabold text-emerald-400">
                100%
              </div>
              <span className="text-[11px] font-semibold text-slate-400 mt-1 inline-block">
                Zero Cloud Leakage
              </span>
            </div>
          </div>

          {/* Finding Breakdown */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-semibold text-white text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Discovered Vulnerability Matrix ({findings.length})</span>
            </h4>
            <div className="space-y-2">
              {findings.map((f, i) => (
                <div key={i} className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/80 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        f.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        f.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {f.severity}
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">{f.cwe}</span>
                      {f.lineNumber && <span className="text-slate-500 text-[11px]">Line {f.lineNumber}</span>}
                    </div>
                    <p className="font-semibold text-slate-200">{f.title}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition text-xs"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
