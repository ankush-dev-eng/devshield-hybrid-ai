import { fetchAndActivate, getValue } from 'firebase/remote-config';
import { services } from './config';
import type { RemoteConfigSettings } from '../types/security';

const DEFAULT_SETTINGS: RemoteConfigSettings = {
  cloudModelName: 'gemini-3.5-flash-lite',
  securitySensitivity: 'strict',
  autoRedactBeforeCloud: true,
  maxScanLines: 1000,
  enableThinking: false,
};

export async function loadRemoteConfigSettings(): Promise<RemoteConfigSettings> {
  if (!services.remoteConfig) {
    return DEFAULT_SETTINGS;
  }

  try {
    const activated = await fetchAndActivate(services.remoteConfig);
    console.info('Firebase Remote Config activated:', activated);

    const cloudModel = getValue(services.remoteConfig, 'cloud_model_name').asString();
    const sensitivity = getValue(services.remoteConfig, 'security_sensitivity_threshold').asString();
    const autoRedact = getValue(services.remoteConfig, 'auto_redact_on_device').asBoolean();
    const maxLines = getValue(services.remoteConfig, 'max_local_scan_lines').asNumber();
    const thinking = getValue(services.remoteConfig, 'enable_thinking_mode').asBoolean();

    return {
      cloudModelName: cloudModel || DEFAULT_SETTINGS.cloudModelName,
      securitySensitivity: (sensitivity as 'strict' | 'moderate' | 'lenient') || DEFAULT_SETTINGS.securitySensitivity,
      autoRedactBeforeCloud: autoRedact !== undefined ? autoRedact : DEFAULT_SETTINGS.autoRedactBeforeCloud,
      maxScanLines: maxLines || DEFAULT_SETTINGS.maxScanLines,
      enableThinking: thinking !== undefined ? thinking : DEFAULT_SETTINGS.enableThinking,
    };
  } catch (error) {
    console.warn('Could not fetch Remote Config values, using defaults:', error);
    return DEFAULT_SETTINGS;
  }
}
