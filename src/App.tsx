import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { SecurityTelemetry } from './components/SecurityTelemetry';
import { EditorPane } from './components/EditorPane';
import { FindingsPanel } from './components/FindingsPanel';
import { CloudModal } from './components/CloudModal';
import { ConfigModal } from './components/ConfigModal';
import { GuideModal } from './components/GuideModal';
import { DiffModal } from './components/DiffModal';
import { ReportModal } from './components/ReportModal';
import { CyberShieldScene } from './components/CyberShieldScene';
import { SAMPLE_CODES, type CodeSample } from './data/sampleCode';
import { 
  executeHybridCodeScan, 
  sanitizeCodeLocally, 
  checkChromeNanoStatus, 
  calculateComplianceMetrics, 
  generateHardenedCode 
} from './firebase/aiService';
import { loadRemoteConfigSettings } from './firebase/remoteConfigService';
import { services } from './firebase/config';
import type { 
  SecurityFinding, 
  ActiveInferenceMode, 
  ScanTelemetry, 
  RemoteConfigSettings 
} from './types/security';

export default function App() {
  const [code, setCode] = useState(SAMPLE_CODES[0].code);
  const [language, setLanguage] = useState(SAMPLE_CODES[0].language);
  const [inferenceMode, setInferenceMode] = useState<ActiveInferenceMode>('prefer_on_device');
  const [findings, setFindings] = useState<SecurityFinding[]>([]);
  const [telemetry, setTelemetry] = useState<ScanTelemetry | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [onDeviceReady, setOnDeviceReady] = useState(false);
  const [isLiveGuardActive, setIsLiveGuardActive] = useState(true);

  // Modals state
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Cloud Sanitized state
  const [sanitizedCode, setSanitizedCode] = useState(code);
  const [redactedCount, setRedactedCount] = useState(0);

  // Remote config values
  const [remoteSettings, setRemoteSettings] = useState<RemoteConfigSettings>({
    cloudModelName: 'gemini-3.5-flash-lite',
    securitySensitivity: 'strict',
    autoRedactBeforeCloud: true,
    maxScanLines: 1000,
    enableThinking: false,
  });

  // Calculate compliance metrics dynamically
  const metrics = calculateComplianceMetrics(findings);

  // Calculate hardened code for diff comparison
  const hardenedCode = generateHardenedCode(code, findings);

  // Reference for debounced live scanning
  const debounceTimerRef = useRef<number | null>(null);

  // Trigger Code Scan
  const runScan = async (sourceCode: string, mode: ActiveInferenceMode) => {
    setIsScanning(true);
    try {
      const result = await executeHybridCodeScan(
        sourceCode, 
        mode, 
        remoteSettings.cloudModelName
      );
      setFindings(result.findings);
      setTelemetry(result.telemetry);
    } catch (error) {
      console.error('Scan error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  // Bootstrap on startup
  useEffect(() => {
    async function bootstrap() {
      const config = await loadRemoteConfigSettings();
      setRemoteSettings(config);

      const status = await checkChromeNanoStatus();
      setOnDeviceReady(status.available === 'readily');

      // Auto-scan initial sample code
      runScan(SAMPLE_CODES[0].code, 'prefer_on_device');
    }
    bootstrap();
  }, []);

  // Handle Code Change with optional Debounced Live Guard
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);

    if (isLiveGuardActive) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        runScan(newCode, inferenceMode);
      }, 400);
    }
  };

  // On-Device Secret Sanitization
  const handleSanitize = () => {
    const { sanitizedCode: cleaned, redactedCount: count } = sanitizeCodeLocally(code, findings);
    setCode(cleaned);
    setSanitizedCode(cleaned);
    setRedactedCount(count);
    runScan(cleaned, inferenceMode);
  };

  // Escalate to Cloud
  const handleEscalateCloud = () => {
    const { sanitizedCode: cleaned, redactedCount: count } = sanitizeCodeLocally(code, findings);
    setSanitizedCode(cleaned);
    setRedactedCount(count);
    setIsCloudModalOpen(true);
  };

  // Apply single fix
  const handleApplyFix = (finding: SecurityFinding) => {
    if (finding.codeSnippet && finding.suggestedFix) {
      const updated = code.replace(finding.codeSnippet, finding.suggestedFix);
      setCode(updated);
      setFindings(prev => prev.filter(f => f.id !== finding.id));
    }
  };

  // Accept all hardened fixes from Diff modal
  const handleAcceptAllFixes = () => {
    setCode(hardenedCode);
    runScan(hardenedCode, inferenceMode);
  };

  // Load Sample
  const handleSelectSample = (sample: CodeSample) => {
    setCode(sample.code);
    setLanguage(sample.language);
    runScan(sample.code, inferenceMode);
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 flex flex-col font-sans relative selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      {/* Background Ambient Glow & Grid Layer */}
      <div className="cyber-bg" />

      {/* 3D WebGL Cyber Shield Holographic Scene (GetLayers / Ascend Particle Engine) */}
      <CyberShieldScene
        isScanning={isScanning}
        hasCritical={findings.some(f => f.severity === 'CRITICAL')}
        activeMode={inferenceMode}
      />

      {/* Top Navbar */}
      <Navbar
        inferenceMode={inferenceMode}
        onInferenceModeChange={(mode) => {
          setInferenceMode(mode);
          runScan(code, mode);
        }}
        onOpenSettings={() => setIsConfigModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onOpenDiff={() => setIsDiffModalOpen(true)}
        onOpenReport={() => setIsReportModalOpen(true)}
        isLiveGuardActive={isLiveGuardActive}
        onToggleLiveGuard={() => setIsLiveGuardActive(!isLiveGuardActive)}
        appCheckActive={Boolean(services.appCheck)}
        remoteConfigSynced={Boolean(services.remoteConfig)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 md:p-6 space-y-4 flex flex-col relative z-10">
        {/* GetLayers-style Hero Banner & Holographic Defense Header */}
        <div className="relative glass-panel rounded-2xl p-5 md:p-6 overflow-hidden border border-white/[0.08] shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] uppercase tracking-wider font-semibold">
                <span className="blinking-dot" />
                <span>On-Device Hybrid Intelligence • Chrome Gemini Nano & Firebase Cloud</span>
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
                Autonomous Zero-Egress <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Code Security Shield</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                DevShield analyzes AST vulnerabilities and credential leaks entirely on local silicon using Gemini Nano. 
                Escalations to Firebase Cloud Gemini require explicit cryptographic sanitization and App Check verification.
              </p>
            </div>

            {/* Quick Interactive Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="px-3.5 py-2 rounded-xl bg-slate-950/70 border border-emerald-500/30 backdrop-blur-md">
                <div className="text-[10px] font-mono uppercase text-slate-400">Neural Core</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Gemini Nano Active
                </div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-slate-950/70 border border-cyan-500/30 backdrop-blur-md">
                <div className="text-[10px] font-mono uppercase text-slate-400">Egress Perimeter</div>
                <div className="text-xs font-bold text-cyan-400 mt-0.5">0-Byte Air-Gapped</div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-slate-950/70 border border-indigo-500/30 backdrop-blur-md">
                <div className="text-[10px] font-mono uppercase text-slate-400">App Check</div>
                <div className="text-xs font-bold text-indigo-300 mt-0.5">Enforced</div>
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry Status Bar with OWASP Score */}
        <SecurityTelemetry
          telemetry={telemetry}
          findings={findings}
          metrics={metrics}
          isScanning={isScanning}
          onDeviceReady={onDeviceReady}
        />

        {/* Split Editor and Findings Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          {/* Left: Code Editor (7 cols) */}
          <div className="lg:col-span-7 h-full">
            <EditorPane
              code={code}
              language={language}
              onChange={handleCodeChange}
              onLanguageChange={setLanguage}
              onSelectSample={handleSelectSample}
              onRunScan={() => runScan(code, inferenceMode)}
              onSanitizeSecrets={handleSanitize}
              onEscalateCloud={handleEscalateCloud}
              onReset={() => {
                setCode('');
                setFindings([]);
                setTelemetry(null);
              }}
              isScanning={isScanning}
              hasFindings={findings.length > 0}
            />
          </div>

          {/* Right: Security Vulnerability Inspector (5 cols) */}
          <div className="lg:col-span-5 h-full">
            <FindingsPanel
              findings={findings}
              onApplyFix={handleApplyFix}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#02040a]/80 backdrop-blur-md px-6 py-3.5 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px]">
          <span>DevShield • Built for #BuildHybridAI 2026</span>
          <span className="text-emerald-400/80">Firebase AI Logic (Gemini Nano & Cloud) • App Check • Remote Config</span>
          <span>Open Source Apache 2.0</span>
        </div>
      </footer>

      {/* Modals */}
      <CloudModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        sanitizedCode={sanitizedCode}
        cloudModelName={remoteSettings.cloudModelName}
        redactedCount={redactedCount}
      />

      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        cloudModelName={remoteSettings.cloudModelName}
      />

      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      <DiffModal
        isOpen={isDiffModalOpen}
        onClose={() => setIsDiffModalOpen(false)}
        originalCode={code}
        hardenedCode={hardenedCode}
        language={language}
        onAcceptAllFixes={handleAcceptAllFixes}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        findings={findings}
        metrics={metrics}
        telemetry={telemetry}
        code={code}
      />
    </div>
  );
}
