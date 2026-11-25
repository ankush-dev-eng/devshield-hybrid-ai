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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
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
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-4 flex flex-col">
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
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-3 text-center text-xs text-slate-500">
        <span>DevShield • Built for #BuildHybridAI 2026 • Firebase AI Logic Hybrid Inference (Gemini Nano & Cloud)</span>
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
