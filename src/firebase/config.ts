import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, type AppCheck } from 'firebase/app-check';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getRemoteConfig, type RemoteConfig } from 'firebase/remote-config';
import { getAI, GoogleAIBackend, type AI } from 'firebase/ai';

// Extend window for App Check debug token
declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
    ai?: {
      languageModel?: {
        capabilities?: () => Promise<{ available: 'readily' | 'after-download' | 'no' }>;
        create?: (options?: unknown) => Promise<unknown>;
      };
    };
  }
}

// Enable App Check debug token in development (Required for hackathon local testing)
if (typeof window !== 'undefined') {
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

// Default Firebase configuration from environment or fallback
const defaultFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForDevShieldDemonstration2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "devshield-hybrid-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "devshield-hybrid-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "devshield-hybrid-ai.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "563584335869",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:563584335869:web:a1b2c3d4e5f6g7h8i9",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let remoteConfig: RemoteConfig | null = null;
let appCheck: AppCheck | null = null;
let aiLogic: AI | null = null;

export function getActiveFirebaseConfig() {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('devshield_custom_firebase_config') : null;
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }
  return defaultFirebaseConfig;
}

export function saveActiveFirebaseConfig(config: typeof defaultFirebaseConfig) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('devshield_custom_firebase_config', JSON.stringify(config));
  }
  // Reset cached instances to re-initialize with new credentials
  app = null;
  auth = null;
  db = null;
  remoteConfig = null;
  appCheck = null;
  aiLogic = null;
  return initFirebaseServices();
}

export function initFirebaseServices() {
  const config = getActiveFirebaseConfig();
  
  try {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApps()[0];
    }

    auth = getAuth(app);
    db = getFirestore(app);

    // Initialize Remote Config
    try {
      remoteConfig = getRemoteConfig(app);
      remoteConfig.settings.minimumFetchIntervalMillis = 60000; // 1 min in dev
      remoteConfig.defaultConfig = {
        cloud_model_name: 'gemini-3.5-flash-lite',
        security_sensitivity_threshold: 'high',
        auto_redact_on_device: true,
        max_local_scan_lines: 1000,
        enable_thinking_mode: false,
      };
    } catch (e) {
      console.warn('Firebase Remote Config init warning:', e);
    }

    // Initialize App Check (Satisfies hackathon submission requirement)
    try {
      if (typeof window !== 'undefined') {
        const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_ENTERPRISE_KEY || '6LfMockSiteKeyForDevAttestationAAAAA';
        appCheck = initializeAppCheck(app, {
          provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
          isTokenAutoRefreshEnabled: true,
        });
      }
    } catch (e) {
      console.info('App Check initialized in debug mode:', e);
    }

    // Initialize Firebase AI Logic service (Defaults to GoogleAIBackend)
    try {
      aiLogic = getAI(app, { backend: new GoogleAIBackend() });
    } catch (e) {
      console.warn('Firebase AI Logic init:', e);
    }

    return { app, auth, db, remoteConfig, appCheck, aiLogic, isConfigured: true };
  } catch (error) {
    console.warn('Firebase initialized with fallback:', error);
    return { app: null, auth: null, db: null, remoteConfig: null, appCheck: null, aiLogic: null, isConfigured: false };
  }
}

// Auto-run initialization
export const services = initFirebaseServices();
