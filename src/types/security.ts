export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type FindingCategory = 
  | 'SECRET_LEAK' 
  | 'INJECTION' 
  | 'INSECURE_AUTH' 
  | 'RCE_COMMAND' 
  | 'DATA_EXPOSURE' 
  | 'SSRF' 
  | 'PATH_TRAVERSAL' 
  | 'WEAK_CRYPTO' 
  | 'BEST_PRACTICE';

export interface SecurityFinding {
  id: string;
  category: FindingCategory;
  severity: Severity;
  title: string;
  description: string;
  cwe?: string;
  owaspCategory?: string;
  lineNumber?: number;
  codeSnippet: string;
  suggestedFix: string;
  redactedSnippet?: string;
}

export type ActiveInferenceMode = 'prefer_on_device' | 'only_on_device' | 'only_in_cloud' | 'prefer_in_cloud';

export interface ScanTelemetry {
  source: 'on_device' | 'in_cloud' | 'rule_engine';
  latencyMs: number;
  egressBytes: number;
  timestamp: number;
  modelUsed: string;
  tokensCount?: number;
}

export interface RemoteConfigSettings {
  cloudModelName: string;
  securitySensitivity: 'strict' | 'moderate' | 'lenient';
  autoRedactBeforeCloud: boolean;
  maxScanLines: number;
  enableThinking: boolean;
}

export interface ComplianceMetrics {
  score: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'F';
  owaspCompliance: number; // %
  zeroEgressPercentage: number;
  totalFindings: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
}
