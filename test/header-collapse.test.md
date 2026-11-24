# Test Report — Header Collapse (`anp-13-header-collapse`)

**Date**: 2026-11-24  
**Auditor**: Agent (`scaffold_tests` + `anp_test`)  
**Scope**: `anp-13-header-collapse/test/`  
**Target Bundle**: `anp-13-header-collapse/build/header-collapse.compiled.js`

---

## 1. Executive Summary

| Metric | Result |
|:---|:---|
| **Total Test Suites** | 3 / 3 ✅ |
| **Total Tests** | 54 |
| **Passed** | 54 ✅ |
| **Failed** | 0 ❌ |
| **Skipped** | 0 ⚠️ |
| **Pass Rate** | **100%** |
| **Confidence Score** | **10/10** (Full coverage across Happy Path, Edge Cases, Error Handling, and Regression) |
| **Regression Coverage** | **Yes** (Full) |

---

## 2. Test Suites & Coverage Breakdown

### 2.1 `test/markdown.test.js` (25 Tests)
- **Happy Path**:
  - Default collapse of H1, H2, and H3 headers using Amplenote comment tags.
  - Default expansion of previously collapsed headers.
  - Preservation of header emojis (`# 🚀 Launch Plan`, `## 💡 Feature Ideas`).
  - Preservation of rich inline markdown (`**bold**`, `*italic*`, `` `code` ``, `[Docs](https://amplenote.com)`).
  - Processing of multi-section notes containing mixed paragraphs, lists, and headers.
  - Selective level targeting: collapses ONLY H1 (`targetLevels = [1]`), collapses ONLY H2 and H3 (`targetLevels = [2, 3]`), expands ONLY H1.
- **Edge Cases**:
  - Empty heading hashes with trailing space (`# `).
  - Bare heading hashes without trailing content (`###`).
  - Lines with 7+ hashes (`#######`) correctly ignored as non-headers.
  - Windows CRLF (`\r\n`) line ending preservation without newline corruption.
  - Untargeted header levels left completely untouched.
- **Error Handling & Input Guards**:
  - Handles `null`, `undefined`, and empty string inputs gracefully.
  - Non-string inputs (numbers, objects) return safely without throwing.
- **Regression Checks**:
  - Fenced code blocks with `#` comments (Python, Ruby, Bash, etc.) untouched during collapse and expansion.
  - Tilde-fenced code blocks (`~~~`) correctly recognized and protected.
  - Whitespace tolerance in JSON tags (`<!-- {"collapsed": true} -->` and `<!-- { "collapsed" : true } -->`) detected and not duplicated.
  - Expansion correctly removes collapse tags with whitespace variations.

### 2.2 `test/api.test.js` (21 Tests)
- **promptInitialAction**:
  - Returns `COLLAPSE_ALL` (1), `EXPAND_ALL` (2), and `ADVANCED` (3).
  - Returns `null` on user cancellation.
  - Returns `null` on unrecognized action responses.
  - Error recovery: returns `null` safely if `app` is missing, `app.prompt` is missing, or `app.prompt` rejects.
- **promptAdvancedOptions**:
  - Returns `{ shouldCollapse: true, targetLevels }` matching checked levels.
  - Returns `null` on user cancellation.
  - Displays `ALERT_NO_LEVELS` alert and returns `null` if no levels are checked.
  - Returns `null` on invalid action values.
  - Error recovery: returns `null` safely on missing `app` or rejected promise.
- **fetchNoteContent**:
  - Fetches note content via `app.getNoteContent({ uuid: noteUUID })`.
  - Throws descriptive error if `app` is missing or invalid.
  - Throws descriptive error if `noteUUID` is missing.
  - Rethrows API errors with diagnostic logging.
- **updateNoteContent**:
  - Replaces note content via `app.replaceNoteContent({ uuid: noteUUID }, content)`.
  - Throws descriptive error if `app` is missing or invalid.
  - Throws descriptive error if `noteUUID` is missing.
  - Rethrows API errors with diagnostic logging.

### 2.3 `test/header-collapse.test.js` (8 Tests)
- **Plugin Orchestration (`noteOption`)**:
  - Complete flow for "Collapse All".
  - Complete flow for "Expand All".
  - Complete two-stage flow for "Advanced..." with selective level targeting.
- **Performance Optimizations**:
  - Skips `app.replaceNoteContent` write call if the note is already collapsed or expanded (avoids redundant sync/network writes).
- **Defensive Boundaries**:
  - Exits safely without throwing if `app` is null.
  - Exits safely without throwing if `noteUUID` is empty.
  - Exits safely without writing if user cancels the initial prompt.
  - Exits safely without writing if user cancels the advanced prompt.
- **Error Handling**:
  - Catches runtime exceptions and alerts the user via `app.alert`.
