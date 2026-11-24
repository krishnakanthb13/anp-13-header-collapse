# Release Notes: Header Collapse

## v0.0.6 (2026-11-24)

### 🐛 Bug Fixes & Correctness
- **Nested / longer fenced code blocks**: Replaced the naive fence toggle with a state machine that tracks the marker character and length. A ```` ```` ```` block containing ``` lines (or `~~~` inside a ``` block) no longer closes early, so code inside it is never modified.
- **Indented headings**: ATX headings indented by up to three spaces (`   # Title`) are now collapsed/expanded correctly (per GFM); four-space indentation remains treated as code.
- **Stale `collapsed:false` annotations**: Normalized to a single canonical `{"collapsed":true}` on collapse, and fully stripped on expand, instead of appending a duplicate/conflicting tag.
- **Whitespace preservation**: The annotation is added/removed on the original line, preserving internal heading spacing and indentation.
- **Mixed line endings**: LF and CRLF are preserved per line instead of being unified.

### 🔒 Host Reliability
- **`replaceNoteContent` bool is unreliable**: Some Amplenote versions resolve `false` even when the write succeeds. The plugin now confirms a `false` result by reading the note back; if the content changed the operation is treated as done, and if it is unchanged a `console.warn` is emitted. This removes the spurious "write rejected" error.
- **Content-size guard**: Rejects writes exceeding Amplenote's 200,000-character limit before calling the API.
- **Input coercion**: Numeric-string dialog values are coerced, and short/partial advanced-dialog result arrays are rejected.

### 🧪 Tests & Docs
- **68 tests** across 3 suites (markdown 29, api 27, header-collapse 12), including new regressions for nested fences, indented headings, mixed EOL, `collapsed:false`, write-result handling, size limits, and non-string content.
- Rebuilt distribution bundle; synced `README`, `CODE_DOCUMENTATION`, `DESIGN_PHILOSOPHY`, `SECURITY`, and test reports.

---

## v0.0.5 (2026-11-24)

### 🚀 New Features
- **Official Plugin Marketplace Launch**: 1-click installation available directly in the Amplenote Plugin Directory at https://www.amplenote.com/plugins/ZH9S9xFfNBeoHbhJJMuKMJ2x.
- **Two-Stage Progressive Action Dialog**: Clean single entry point in the note options menu that opens a fast selector for **Collapse All**, **Expand All**, or **Advanced...**.
- **Granular Header Level Targeting**: Advanced mode allows users to selectively target any combination of header levels:
  - H1 (`#`)
  - H2 (`##`)
  - H3 (`###`)
  - H4–H6 (`####+`)
  Untargeted headers and sections remain completely untouched.

### ⚡ Improvements & Optimizations
- **Redundant Note Write Prevention**: Skips `app.replaceNoteContent` if the note content is already in the requested state, preserving revision history and saving sync bandwidth.
- **O(1) Set-Based Level Filtering**: Header level lookups are optimized using a `Set` initialized once per invocation.
- **Precompiled Global Regex**: Replaced per-line RegExp constructor instantiations with a module-level precompiled constant (`COLLAPSE_TAG_GLOBAL_REGEX`).
- **Modern Modular Architecture**: Cleanly broken down into dedicated ES modules in `lib/` with strict separation between pure logic and platform APIs.

### 🐛 Bug Fixes & Edge Cases Handled
- **Fenced Code Block Protection**: Programming comments starting with `#` inside Python, Ruby, Shell, or other code blocks are now completely immune from modification during collapse and expansion.
- **JSON Comment Whitespace Tolerance**: Recognizes `<!-- {"collapsed": true} -->` with spaces, preventing duplicate tags from being appended.
- **Strict 1–6 Heading Hashes**: Restricts matching to valid Markdown header levels `#{1,6}`, ignoring 7+ hashes (`#######`).
- **Windows CRLF Preservation**: Preserves `\r\n` line endings without altering document formatting.

### 🛡️ Security & Hardening
- **Zero Runtime Dependencies**: Compiled bundle is 100% self-contained vanilla JavaScript.
- **100% Offline & Private**: Zero network calls, zero telemetry, zero data exfiltration.
- **Input Validation**: Host API calls are guarded by defensive parameter checks and `try/catch` error boundaries.
- **Formal Security Audit**: Verified clean with 0 Critical, 0 Warnings, and complete `SECURITY.md` compliance.

### 🧪 Test Suite & Quality
- **54 Passing Tests Across 3 Suites**: Comprehensive Jest coverage across Happy Path, Edge Cases, Error Handling, and Regression checks.
- **10/10 Confidence Score**: Detailed test artifacts logged in `header-collapse.test.md`, `.txt`, and `.log`.

### 📚 Documentation
- Generated full `README.md` with metadata table setup, `CODE_DOCUMENTATION.md`, `DESIGN_PHILOSOPHY.md`, and `SECURITY.md`.
- **Video Walkthrough**: Published complete walkthrough on YouTube at [https://youtu.be/5q-9MK6RdQY](https://youtu.be/5q-9MK6RdQY).
