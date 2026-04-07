# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

**Do not open a public issue.** Instead, email us at:

📧 **kevin@dishine.it**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)

We'll acknowledge your report within 48 hours and work on a fix.

## Scope

This project has **zero npm dependencies** and runs entirely on Node.js built-in modules. The main security considerations are:

- **API keys** — stored in browser localStorage (Playground and AI Optimizer). Keys are never sent anywhere except the selected API provider (OpenAI, Anthropic, or Google).
- **Custom prompts** — stored locally on disk (`~/.prompt-library/`) or in browser localStorage. No data leaves your machine unless you explicitly use the Playground.
- **viewer.html** — a self-contained HTML file with no external requests. Works completely offline.
- **Desktop apps** — use the same `viewer.html` in a native window. No telemetry, no network calls (except when you use the Playground).

## Supported Versions

| Version | Supported |
|---------|-----------|
| 2.3.x   | ✅ Current |
| < 2.3   | ❌ No longer supported |
