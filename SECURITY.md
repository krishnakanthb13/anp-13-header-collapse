# Security Audit — Header Collapse (`anp-13-header-collapse`)

**Date**: 2026-11-24  
**Auditor**: Agent (`anp_security`)  
**Scope**: `anp-13-header-collapse/` (`header-collapse.js`, `lib/`, `build/`, `test/`)

---

## Summary

| Severity | Count | Status |
|:---|:---:|:---|
| 🔴 **Critical** | 0 | None found |
| 🟡 **Warning**  | 0 | None found |
| 🟢 **Passed**   | 7 | All checks passed |

---

## Findings

### 🔴 Critical
*No critical vulnerabilities found.*

### 🟡 Warning
*No warnings found.*

### 🟢 Passed

1. **Hardcoded Secrets & Credential Leakage**:
   - Automated regex scanning across all source, library, and test files detected zero hardcoded API keys, bearer tokens, passwords, private keys, or secrets.
   - The plugin operates entirely within the local Amplenote note environment and does not make or require any network calls or authentication tokens.

2. **Code Execution & Injection Defense**:
   - Zero occurrences of `eval()`, `new Function()`, `document.write()`, or string-evaluated timer patterns (`setTimeout("...", ...)`).
   - No unauthorized dynamic `<script>` tag injections or untrusted remote code evaluation.

3. **Cross-Site Scripting (XSS) & HTML Injection Defense**:
   - The plugin does not generate, render, or inject raw HTML strings or DOM elements.
   - All user interactions occur through native Amplenote dialog APIs (`app.prompt`, `app.alert`), which are rendered safely by the host application.
   - Markdown manipulation is strictly text-based (`#`, `##`, `###`, etc.) and manipulates only HTML comments (`<!-- {"collapsed":true} -->`) compliant with Amplenote's native header folding format.

4. **ReDoS (Regular Expression Denial of Service) Prevention**:
   - Regex patterns (`HEADER_PATTERN = /^(#{1,6})(?:\s+(.*?)|$)\s*$/`, `COLLAPSE_TAG_REGEX = /<!--\s*\{\s*"collapsed"\s*:\s*true\s*\}\s*-->/i`, `CODE_BLOCK_FENCE_REGEX = /^\s*(```|~~~)/`) have bounded quantifier checks (`#{1,6}`) and non-nested quantifiers.
   - Execution time scales strictly linearly ($O(N)$) with the note line count, preventing CPU exhaustion or catastrophic backtracking.

5. **Data Privacy & Zero Exfiltration**:
   - **Zero external network requests**: The plugin makes no calls to `fetch()`, `XMLHttpRequest`, WebSockets, or third-party servers.
   - **100% Offline and Private**: Note contents never leave the user's local client application.
   - Zero analytics, telemetry, tracking pixels, or third-party tracking scripts.

6. **Defensive Host Boundaries & Input Validation**:
   - Both `promptInitialAction` and `promptAdvancedOptions` validate that returned action values strictly match recognized enum values (`ACTION_OPTIONS` and `ADVANCED_ACTION`) before resolving.
   - All Amplenote host calls (`app.prompt`, `app.alert`, `app.getNoteContent`, `app.replaceNoteContent`) are guarded by `try/catch` blocks and validate presence of `app` and `noteUUID`.
   - In `header-collapse.js`, `if (modifiedMarkdown !== markdown)` ensures the note is only rewritten if content actually changed, avoiding redundant database/sync writes.

7. **Supply Chain & Production Bundle**:
   - The compiled distribution bundle (`build/header-collapse.compiled.js`) has **zero external production runtime dependencies**.
   - Repository-level development dependencies (`jest`, `eslint`, `prettier`, `esbuild`) are confined to local developer tooling and do not enter the production runtime sandbox.
