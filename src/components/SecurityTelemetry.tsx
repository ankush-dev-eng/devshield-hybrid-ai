import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  CloudRain, 
  Timer, 
  FileCode2, 
  Layers, 
  Award 
} from 'lucide-react';
import type { ScanTelemetry, SecurityFinding, ComplianceMetrics } from '../types/security';

interface SecurityTelemetryProps {
  telemetry: ScanTelemetry | null;
  findings: SecurityFinding[];
  metrics: ComplianceMetrics;
  isScanning: boolean;
  onDeviceReady: boolean;
}

export const SecurityTelemetry: React.FC<SecurityTelemetryProps> = ({
  telemetry,
  findings,
  metrics,
  isScanning,
  onDeviceReady,
}) => {
  const isLocal = telemetry?.source === 'on_device' || !telemetry;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Active Engine */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Inference Engine</span>
            {isLocal ? (
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <CloudRain className="w-3.5 h-3.5 text-sky-400" />
            )}
          </div>
          <div className="font-semibold text-sm truncate flex items-center gap-1.5">
            {isScanning ? (
              <span className="text-amber-400 animate-pulse">Auditing Code...</span>
            ) : isLocal ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                ⚡ Gemini Nano (Local)
              </span>
            ) : (
              <span className="text-sky-400 flex items-center gap-1">
                ☁️ Cloud Gemini 3.5
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {onDeviceReady ? 'Chrome Nano Ready' : 'Hybrid Fallback Active'}
          </div>
        </div>

        {/* Zero-Egress Privacy */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Data Egress</span>
            <ShieldCheck className={`w-3.5 h-3.5 ${isLocal ? 'text-emerald-400' : 'text-amber-400'}`} />
          </div>
          <div className="font-semibold text-sm">
            {isLocal ? (
              <span className="text-emerald-300">0 Bytes (Zero-Leakage)</span>
            ) : (
              <span className="text-amber-300">Sanitized Payload</span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {isLocal ? 'Code never left device' : 'Redacted before transit'}
          </div>
        </div>

        {/* Latency Meter */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Inference Latency</span>
            <Timer className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="font-semibold text-sm text-white">
            {telemetry ? `${telemetry.latencyMs} ms` : '—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {isLocal ? 'Sub-second real-time speed' : 'Cloud round-trip time'}
          </div>
        </div>

        {/* OWASP Security Score */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Compliance Score</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-sm font-bold ${
              metrics.score >= 80 ? 'text-emerald-400' : metrics.score >= 50 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {metrics.score} / 100
            </span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-200">
              Grade: {metrics.grade}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            OWASP: {metrics.owaspCompliance}% compliant
          </div>
        </div>

        {/* Security Findings Summary */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Vulnerability Matrix</span>
            <Layers className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {findings.length === 0 ? (
              <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
                <FileCode2 className="w-3.5 h-3.5" /> Clean / No Leaks
              </span>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {metrics.criticalCount > 0 && (
                  <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded text-[11px]">
                    {metrics.criticalCount} Crit
                  </span>
                )}
                {metrics.highCount > 0 && (
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded text-[11px]">
                    {metrics.highCount} High
                  </span>
                )}
                {metrics.mediumCount > 0 && (
                  <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-1.5 py-0.5 rounded text-[11px]">
                    {metrics.mediumCount} Med
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {findings.length} total flags found
          </div>
        </div>
      </div>
    </div>
  );
};
