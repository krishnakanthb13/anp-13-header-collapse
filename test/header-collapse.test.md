# Test Report — Header Collapse (`anp-13-header-collapse`)

**Date**: 2026-11-24
**Version**: `v0.0.6`
**Scope**: `anp-13-header-collapse/test/`
**Target Bundle**: `anp-13-header-collapse/build/header-collapse.compiled.js`

---

## 1. Executive Summary

| Metric | Result |
|:---|:---|
| **Total Test Suites** | 3 / 3 ✅ |
| **Total Tests** | 68 |
| **Passed** | 68 ✅ |
| **Failed** | 0 ❌ |
| **Skipped** | 0 ⚠️ |
| **Pass Rate** | **100%** |
| **Confidence Score** | **10/10** (Happy Path, Edge Cases, Error Handling, Regression) |

---

## 2. Test Suites & Coverage Breakdown

### 2.1 `test/markdown.test.js` (29 Tests)
- **Happy Path**:
  - Default collapse of H1, H2, and H3 headers using Amplenote comment tags.
  - Default expansion of previously collapsed headers.
  - Preservation of header emojis (`# 🚀 Launch Plan`, `## 💡 Feature Ideas`).
  - Preservation of rich inline markdown (`**bold**`, `*italic*`, `` `code` ``, `[Docs](https://amplenote.com)`).
  - Processing of multi-section notes containing mixed paragraphs, lists, and headers.
  - Selective level targeting: `[1]`, `[2, 3]`, and expand `[1]`.
- **Edge Cases**:
  - Empty heading hashes with trailing space (`# `).
  - Bare heading hashes without trailing content (`###`).
  - Lines with 7+ hashes (`#######`) correctly ignored.
  - CRLF (`\r\n`) line ending preservation.
  - Untargeted header levels left completely untouched.
  - **Indented headings** (1–3 spaces) collapse/expand; four-space stays code.
  - **Internal spacing preserved** on modified headings (`##    Heading`).
  - **`collapsed:false`** normalized on collapse and stripped on expand.
  - **Mixed LF/CRLF** preserved per line.
- **Error Handling & Input Guards**:
  - Handles `null`, `undefined`, and empty string inputs gracefully.
  - **Non-string input returns `""`** without throwing.
- **Regression Checks**:
  - Fenced code blocks with `#` comments untouched during collapse and expansion.
  - Tilde-fenced code blocks (`~~~`) recognized and protected.
  - **Four-backtick block containing ``` lines** is not closed early (nested-fence state machine).
  - **`~~~` inside a ``` block** is not treated as a closing fence.
  - Whitespace tolerance in JSON tags (`<!-- {"collapsed": true} -->` and `<!-- { "collapsed" : true } -->`) detected and not duplicated.
  - Expansion correctly removes collapse tags with whitespace variations.

### 2.2 `test/api.test.js` (27 Tests)
- **promptInitialAction**:
  - Returns `COLLAPSE_ALL` (1), `EXPAND_ALL` (2), and `ADVANCED` (3).
  - Returns `null` on cancellation or unrecognized action.
  - Coercion and error recovery with missing `app`/`prompt` or rejected prompt.
- **promptAdvancedOptions**:
  - Returns `{ shouldCollapse, targetLevels }` matching checked levels.
  - Returns `null` on cancellation, invalid action, or **short/partial result array**.
  - **Coerces numeric-string action values.**
  - Alerts `ALERT_NO_LEVELS` and returns `null` when no levels are checked.
- **fetchNoteContent**:
  - Fetches content via `app.getNoteContent({ uuid })`; validates input; rethrows errors.
- **updateNoteContent**:
  - Replaces content and **reports success (`true`)**.
  - **Returns `false` when the host reports the write was not performed.**
  - **Throws before writing when content exceeds 200,000 characters.**
  - Validates input and rethrows host errors.

### 2.3 `test/header-collapse.test.js` (12 Tests)
- **Plugin Orchestration (`noteOption`)**:
  - Collapse All, Expand All, and Advanced selective flows.
  - Skips `replaceNoteContent` when content is unchanged.
- **Defensive Boundaries**:
  - Exits safely on missing `app`/`noteUUID` and on Stage 1/Stage 2 cancellation.
- **Error Handling**:
  - Catches runtime exceptions and alerts the user.
  - **Does not alert when the host resolves `false` but the write actually applied** (read-back verification).
  - **Logs (does not alert) when the host resolves `false` and content is unchanged.**
  - **Alerts when the note content is not a string.**

---

## 3. Notes
- Some Amplenote versions resolve `replaceNoteContent` with `false` even after a successful write. The suite covers both the "write applied" and "write did not apply" branches.
- The stray `header-collapse.test.log` artifact was removed in v0.0.6.
