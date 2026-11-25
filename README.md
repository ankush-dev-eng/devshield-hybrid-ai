# DevShield — Privacy-Preserving Hybrid Code Security Auditor

> Built for the **#BuildHybridAI 2026** Hackathon  
> Powered by **Firebase AI Logic** (`InferenceMode.PREFER_ON_DEVICE`), **App Check**, and **Remote Config**.

---

## Overview & Value Proposition

Software engineers and enterprise development teams frequently work with proprietary source code, internal database queries, and live credentials. Blindly sending raw code to external cloud LLMs violates corporate data residency policies, risks credential leakage, and introduces network latency.

**DevShield** solves this by implementing **Hybrid AI Inference**:
- **On-Device (Gemini Nano in Chrome via Firebase AI Logic)**: 
  - Performs instant, real-time code scanning as you type.
  - Detects hardcoded secrets (Stripe, AWS, JWTs), SQL injection, SSRF, command injection, and path traversal with **zero data egress (0 bytes sent to cloud)**.
  - Sanitizes and redacts credentials directly on the client machine before any external sharing.
- **Cloud Escalation (Cloud Gemini via Firebase AI Logic)**:
  - Triggered only on explicit user request for deep, compute-heavy tasks: automated security regression test generation (Jest/PyTest) and full architectural hardening.
  - Transmits **only sanitized code payloads** with production credentials masked.

---

## Core Features

- **⚡ Prefer On-Device Inference**: Utilizes Chrome's built-in Gemini Nano (`window.ai.languageModel`) with automatic fallback to Cloud Gemini (`gemini-3.5-flash-lite`).
- **🛡️ Live Guard**: Debounced real-time as-you-type code auditing in $< 400\text{ms}$.
- **⚖️ Visual Security Diff Inspector**: Side-by-side Monaco DiffEditor comparing vulnerable code against DevShield's auto-hardened mitigations with a one-click "Apply All" trigger.
- **📄 Executive Compliance Report**: Calculates an OWASP Top 10 compliance score ($0 - 100$) and letter grade ($A+$ through $F$), with one-click export to Markdown and JSON.
- **🔒 On-Device Secret Masking**: One-click redaction replacing live credentials with zero-leak tokens.
- **☁️ Cloud Security Test Generation**: Generates comprehensive unit test suites asserting that vulnerabilities are neutralized.

---

## Firebase Platform Integration

| Firebase Product | How It Is Used in DevShield |
| :--- | :--- |
| **Firebase AI Logic (`firebase/ai`)** | Powers both local Gemini Nano execution (`InferenceMode.PREFER_ON_DEVICE`) and Cloud Gemini fallback. Reads runtime `InferenceSource` to provide telemetry. |
| **Firebase App Check (`firebase/app-check`)** | Attests client requests and protects API quotas. Configured with debug token support (`self.FIREBASE_APPCHECK_DEBUG_TOKEN = true`) for hackathon evaluation. |
| **Firebase Remote Config (`firebase/remote-config`)** | Dynamically pushes model names, sensitivity thresholds, and scanning parameters without requiring client redeployments. |
| **Firebase Firestore (`firebase/firestore`)** | Structured storage for audit logs, scan telemetry, and custom security rulesets. |
| **Firebase Authentication (`firebase/auth`)** | User identity and access control for synchronized audit history. |

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Code Editor**: Monaco Editor (VS Code core engine) & Monaco DiffEditor
- **AI SDK**: Firebase JavaScript SDK (`firebase@latest` / `firebase/ai`)
- **Icons**: Lucide React

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- Google Chrome (with Prompt API / Gemini Nano enabled for on-device inference)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/devshield-hybrid-ai.git
   cd devshield-hybrid-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in Google Chrome.

---

## Enabling Chrome Gemini Nano (Prompt API)

To enable Gemini Nano on-device in Google Chrome:
1. Navigate to `chrome://flags/#prompt-api-for-gemini-nano` and set to **Enabled**.
2. Navigate to `chrome://flags/#optimization-guide-on-device-model` and set to **Enabled BypassPerfRequirement**.
3. Go to `chrome://components` and click **Check for update** under **Optimization Guide On Device Model**.

---

## License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](LICENSE) file for details.
