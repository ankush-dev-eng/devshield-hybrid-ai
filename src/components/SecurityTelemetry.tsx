import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  CloudRain, 
  Timer, 
  Award,
  ShieldAlert,
  Activity
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
  const criticalCount = findings.filter(f => f.severity === 'CRITICAL').length;
  const highCount = findings.filter(f => f.severity === 'HIGH').length;
  const medCount = findings.filter(f => f.severity === 'MEDIUM').length;

  return (
    <div className="relative glass-panel rounded-2xl p-4 shadow-2xl transition-all">
      {/* Scanning Bar Indicator */}
      {isScanning && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 animate-pulse rounded-t-2xl overflow-hidden" />
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Active Engine */}
        <div className="bg-slate-950/60 border border-white/[0.06] rounded-xl p-3.5 hover:border-emerald-500/30 transition-colors group">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            <span>Inference Engine</span>
            {isLocal ? (
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <CloudRain className="w-3.5 h-3.5 text-sky-400" />
            )}
          </div>
          <div className="font-display font-bold text-sm truncate flex items-center gap-2">
            {isScanning ? (
              <span className="text-amber-400 animate-pulse flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 animate-spin" />
                Auditing Code...
              </span>
            ) : isLocal ? (
              <span className="text-emerald-400 flex items-center gap-2">
                <span className="blinking-dot" />
                ⚡ Gemini Nano (Local)
              </span>
            ) : (
              <span className="text-sky-400 flex items-center gap-1.5">
                ☁️ Cloud Gemini 3.5
              </span>
            )}
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">
            {onDeviceReady ? 'Chrome Nano Ready' : 'Hybrid Fallback Active'}
          </div>
        </div>

        {/* Zero-Egress Privacy */}
        <div className="bg-slate-950/60 border border-white/[0.06] rounded-xl p-3.5 hover:border-emerald-500/30 transition-colors group">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            <span>Data Egress</span>
            <ShieldCheck className={`w-3.5 h-3.5 ${isLocal ? 'text-emerald-400' : 'text-amber-400'}`} />
          </div>
          <div className="font-display font-bold text-sm">
            {isLocal ? (
              <span className="text-emerald-300 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_#10b981]" />
                0 Bytes (Zero-Leakage)
              </span>
            ) : (
              <span className="text-amber-300">Sanitized Payload</span>
            )}
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">
            {isLocal ? 'Code never left device' : 'Redacted before transit'}
          </div>
        </div>

        {/* Latency Meter */}
        <div className="bg-slate-950/60 border border-white/[0.06] rounded-xl p-3.5 hover:border-sky-500/30 transition-colors group">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            <span>Inference Latency</span>
            <Timer className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="font-mono font-bold text-sm text-white">
            {telemetry ? `${telemetry.latencyMs} ms` : '—'}
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">
            {isLocal ? 'Sub-second real-time speed' : 'Cloud round-trip time'}
          </div>
        </div>

        {/* OWASP Security Score */}
        <div className="bg-slate-950/60 border border-white/[0.06] rounded-xl p-3.5 hover:border-amber-500/30 transition-colors group">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            <span>Compliance Rating</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold ${
              metrics.score >= 80 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                : metrics.score >= 50 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}>
              {metrics.grade}
            </span>
            <span className="font-mono font-bold text-sm text-slate-200">
              {metrics.score}/100
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">
            OWASP Top 10 Standard
          </div>
        </div>

        {/* Vulnerability Flag Counter */}
        <div className="bg-slate-950/60 border border-white/[0.06] rounded-xl p-3.5 hover:border-rose-500/30 transition-colors group col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            <span>Security Health</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {findings.length === 0 ? (
              <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
                ✓ 100% Clean Code
              </span>
            ) : (
              <>
                {criticalCount > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 text-[11px] font-mono font-bold border border-rose-500/40">
                    {criticalCount} Critical
                  </span>
                )}
                {highCount > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[11px] font-mono font-bold border border-amber-500/40">
                    {highCount} High
                  </span>
                )}
                {medCount > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-400 text-[11px] font-mono font-bold border border-sky-500/40">
                    {medCount} Med
                  </span>
                )}
              </>
            )}
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-1">
            {findings.length} total vulnerability flags
          </div>
        </div>
      </div>
    </div>
  );
};
