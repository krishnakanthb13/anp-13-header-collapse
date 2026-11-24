# Code Audit & Remediation — Header Collapse (`anp-13-header-collapse`)

**Audit date:** 2026-11-24
**Status:** ✅ Remediated — all High/Medium findings fixed and covered by regression tests; low-severity items fixed or explicitly accepted (see notes).
**Version:** `v0.0.6` (see [`RELEASE_NOTES.md`](RELEASE_NOTES.md))
**Scope:** [`header-collapse.js`](header-collapse.js), [`lib/`](lib/) (`api.js`, `constants.js`, `markdown.js`), [`build/header-collapse.compiled.js`](build/header-collapse.compiled.js), [`test/`](test/), and project docs.
**Method:** source review, cross-check against [`../amplenote_references/`](../amplenote_references/) (notably [`prompt.md`](../amplenote_references/app-interface/prompt.md), [`replaceNoteContent.md`](../amplenote_references/app-interface/replaceNoteContent.md), [`guides/markdown-reference.md`](../amplenote_references/guides/markdown-reference.md)), `npm test`, and targeted Node repro scripts.

## Verification (post-fix)

| Check | Result |
| :--- | :--- |
| Jest suite | **3 suites, 68 / 68 tests passing** (`markdown` 29, `api` 27, `header-collapse` 12) |
| Nested-fence repro | Inner `#` lines in a 4-backtick block stay untouched |
| Indented headings | `   # Indented` collapsed/expanded |
| Mixed EOL | LF and CRLF preserved per line |
| `collapsed:false` | Normalized to a single canonical `true` annotation |
| Bundle | Rebuilt via `node esbuild.js 13` (**8,317 bytes**) |
| Docs | `README`, `CODE_DOCUMENTATION`, `DESIGN_PHILOSOPHY`, `SECURITY`, `RELEASE_NOTES`, test reports synced |

**Verified platform assumptions (correct):**
- Collapse annotation `# Heading <!-- {"collapsed": true} -->` is the documented Amplenote format ([markdown-reference.md](../amplenote_references/guides/markdown-reference.md)).
- `app.prompt` returns a bare value for a single input and an array (in input order) for multiple inputs ([prompt.md](../amplenote_references/app-interface/prompt.md)).
- `app.replaceNoteContent(...) → Promise<boolean>` ("whether the replacement was performed").
- Markdown writes are capped at **200,000 characters per call**.

---

## Severity summary

| Severity | Count | Theme |
|---|---:|---|
| 🔴 High | 1 | Silent content corruption inside fenced code blocks |
| 🟠 Medium | 5 | Ignored write result, stale-snapshot overwrite, annotation handling, indented headings, whitespace mutation |
| 🟡 Low | 12 | Setext/mixed-EOL/parsing polish, contract robustness, docs/test hygiene |

---

## 🔴 High

### H1. Fence handling was a naive toggle, corrupting nested / longer-fenced code blocks — ✅ FIXED
**Where:** [`lib/markdown.js`](lib/markdown.js), [`lib/constants.js`](lib/constants.js)

The parser flipped `inCodeBlock` on any line starting with three backticks or tildes, never remembering the opening fence's character or length. A 4-backtick block containing an inner ``` line was closed early, and the following `#` line (still inside the code block) was collapsed.

**Resolution:** Replaced the boolean toggle with a fence state machine (`CODE_FENCE_PATTERN` + `fence = { char, len }`). A closing fence must now use the same character, be at least as long as the opening fence, and carry no info string. Verified by two new regression tests (4-backtick block with inner ``` lines; `~~~` inside a ``` block).

---

## 🟠 Medium

### M1. `replaceNoteContent`'s boolean return was ignored — ✅ FIXED (best-effort, host-aware)
**Where:** [`lib/api.js`](lib/api.js), [`header-collapse.js`](header-collapse.js)

`updateNoteContent` now returns `(await app.replaceNoteContent(...)) !== false` so the result is no longer silently discarded. **Field finding:** some Amplenote versions resolve `false` even when the write actually applied (the local note is updated). Treating `false` as a hard failure caused a spurious "write rejected" error, so the orchestrator now re-reads the note when `false` is returned and only logs a `console.warn` if the content genuinely did not change — it never raises a user-facing error for this case. Covered by tests in `api.test.js` and `header-collapse.test.js` (including "resolves false but the write applied").

### M2. Whole-note rewrite was based on a pre-prompt snapshot — ✅ FIXED
**Where:** [`header-collapse.js`](header-collapse.js)

Reordered so both dialogs run **before** `getNoteContent`, minimizing the window between reading and replacing the whole note. (A whole-note replace is inherent to the operation; the gap is now as small as practical and documented.)

### M3. `collapsed:false` was not recognized, causing duplicate/conflicting annotations — ✅ FIXED
**Where:** [`lib/constants.js`](lib/constants.js), [`lib/markdown.js`](lib/markdown.js)

Added `COLLAPSE_TAG_ANY_REGEX` (matches `true`/`false`) and widened `COLLAPSE_TAG_GLOBAL_REGEX` to strip either value plus its preceding whitespace. Collapsing now normalizes any existing annotation to the canonical `true`; already-`true` lines remain byte-identical (idempotent). Expanding strips both forms. Regression tests added.

### M4. Valid indented ATX headings (1–3 spaces) were skipped — ✅ FIXED
**Where:** [`lib/constants.js`](lib/constants.js)

`HEADER_PATTERN` now allows `0–3` leading spaces: `/^ {0,3}(#{1,6})(?:[ \t]+(.*?))?[ \t]*$/`. Four-space indentation is still treated as code and left alone. Regression test added.

### M5. Modified headings were whitespace-normalized / trailing space lost — ✅ FIXED
**Where:** [`lib/markdown.js`](lib/markdown.js)

The transformer now operates on the original line (append/strip the annotation) instead of rebuilding `${hashes} ${content}`, so internal spacing and indentation are preserved (`##    Heading` stays intact). Only unavoidable trailing whitespace on an otherwise-empty heading (`# `) is still dropped on expand.

---

## 🟡 Low / quality

| # | Finding | Status |
|---|---|---|
| L1 | Setext headings (`Title\n===`) unsupported | ⏸️ Accepted, documented limitation |
| L2 | Mixed line endings were unified | ✅ Fixed — split/join preserves each line's terminator |
| L3 | ATX closing sequences kept as content (`## foo ##`) | ⏸️ Accepted, round-trips correctly and is cosmetic |
| L4 | Advanced dialog short array could target fewer levels | ✅ Fixed — rejects arrays shorter than the input count |
| L5 | Action values required exact numeric types | ✅ Fixed — coerced with `Number(...)` before validation |
| L6 | No 200k content-size guard | ✅ Fixed — `updateNoteContent` throws before writing |
| L7 | Non-string note content returned silently | ✅ Fixed — alerts "Could not read the note content." |
| L8 | No success toast | ⏸️ Accepted — Amplenote exposes no non-modal notification API |
| L9 | Single-line / unclosed fences swallowed the rest | ✅ Covered by the fence state machine (unclosed fence correctly protects the remainder) |
| L10 | Stray generated artifacts in `test/` | ✅ Removed `header-collapse.test.log`; reports kept/updated |
| L11 | `processMarkdown` returned non-string input unchanged | ✅ Fixed — always returns `""` for non-string/empty input |
| L12 | `app.alert` inside `catch` could throw unhandled | ✅ Fixed — `safeAlert()` wraps the alert call |

---

## Test gaps → now covered

| Finding | Regression test |
|---|---|
| H1 | 4-backtick block containing ``` lines; `~~~` inside a ``` block |
| M1 | `replaceNoteContent` resolves `false`: write applied → no alert; content unchanged → console warning only |
| M3 | `collapsed:false` normalized on collapse; stripped on expand |
| M4 | `   # Indented` collapsed/expanded |
| M5 | `##    Heading` preserves internal spacing |
| L2 | Mixed LF/CRLF preserved per line |
| L4 | Short advanced result array rejected |
| L5 | Numeric-string action coerced |
| L6 | Content > 200,000 throws before write |
| L7 | Non-string content alerts and skips write |

---

## What is already solid

- Correct platform contract for the collapse annotation and both `app.prompt` shapes.
- Pure transformer with zero side effects and zero `app.*` dependencies.
- Defensive host wrappers with graceful cancel handling at both stages.
- No-op write suppression (`modifiedMarkdown !== markdown`).
- Bounded, linear-time regexes; shared non-global `.test` vs. global `.replace` split avoids `lastIndex` statefulness.
- Zero dependencies / offline in the compiled bundle.

---

## Verdict

All High/Medium findings are resolved and covered by tests (68 passing). The two remaining items are explicitly accepted: Setext-heading support (documented limitation) and a success toast (no non-modal API exists). Note that write verification is intentionally best-effort because the host's `replaceNoteContent` boolean is unreliable (returns `false` on success in some versions). No security concerns were introduced; the earlier `SECURITY.md` assessment still holds.
