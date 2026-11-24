# Code Documentation — Header Collapse Plugin (`anp-13-header-collapse`)

## Overview
The **Header Collapse Plugin** enables users to quickly collapse or expand all headers across an Amplenote note, or selectively target specific header levels (H1, H2, H3, H4–H6). It is built as a set of modular ES modules that compile into a self-executing IIFE for injection into an Amplenote plugin note.

---

## Architecture & Module Breakdown

```
anp-13-header-collapse/
├── header-collapse.js                 ← Entry point (orchestrator, ~70 lines)
├── lib/
│   ├── constants.js                   ← Declarative enums, regexes, and dialog schemas
│   ├── markdown.js                    ← Pure markdown line-by-line parser and transformer
│   └── api.js                         ← Amplenote app.* wrappers with validation and guards
├── build/
│   └── header-collapse.compiled.js    ← Production bundle (IIFE wrapped, zero dependencies)
└── test/
    ├── markdown.test.js               ← 29 unit and regression tests for markdown processing
    ├── api.test.js                    ← 27 tests for Amplenote API dialogs and note I/O
    └── header-collapse.test.js        ← 12 tests for end-to-end orchestration and edge cases
```

---

## Core Modules

### 1. Plugin Orchestrator (`header-collapse.js`)
The central entry point implementing Amplenote's `noteOption(app, noteUUID)` action:
- **Two-Stage Execution**:
  - Stage 1 invokes `promptInitialAction` to present standard choices (Collapse All, Expand All, Advanced...).
  - If "Advanced..." is chosen, Stage 2 invokes `promptAdvancedOptions` to extract user-selected header levels.
- **Prompt-Before-Read Ordering**: Both dialogs run before `getNoteContent`, minimizing the window between reading and replacing the whole note so concurrent edits are less likely to be clobbered.
- **Redundant Revision Prevention**:
  - Compares the transformed content against the original note: `if (modifiedMarkdown !== markdown)`.
  - If no headers changed (e.g. note was already collapsed/expanded), the API write is skipped, avoiding unnecessary sync events and revision history clutter.
- **Host-Aware Write Verification**: `updateNoteContent` propagates the host's `replaceNoteContent` boolean. Because some Amplenote versions resolve `false` even after a successful write, a `false` result triggers a read-back: if the content actually changed the operation is considered done; if it is unchanged a `console.warn` is emitted. No user-facing error is raised for this case.
- **Error Boundaries**:
  - Guards against missing `app` or `noteUUID`.
  - Alerts "Could not read the note content." when the fetched content is not a string.
  - Wraps execution in `try/catch`, alerting the user if a runtime error occurs (via a `safeAlert` helper that cannot throw).

### 2. Declarative Constants & Configs (`lib/constants.js`)
Isolates all magic numbers, configuration objects, regex patterns, and UI copy:
- `ACTION_OPTIONS`: Enum for Stage 1 prompt (`COLLAPSE_ALL: 1`, `EXPAND_ALL: 2`, `ADVANCED: 3`).
- `ADVANCED_ACTION`: Enum for Stage 2 prompt (`COLLAPSE: 1`, `EXPAND: 2`).
- `ALL_HEADER_LEVELS`: Immutable array `[1, 2, 3, 4, 5, 6]`.
- `HEADER_PATTERN`: Bounded regex `/^ {0,3}(#{1,6})(?:[ \t]+(.*?))?[ \t]*$/` validating H1–H6, allowing up to three leading spaces (GFM).
- `COLLAPSE_TAG_REGEX`: Matches a header already collapsed (`"collapsed": true`), used for idempotent collapse.
- `COLLAPSE_TAG_ANY_REGEX`: Matches a collapse annotation with either `true` or `false`.
- `COLLAPSE_TAG_GLOBAL_REGEX`: Global strip of any `true`/`false` annotation (plus its preceding whitespace).
- `CODE_FENCE_PATTERN`: Detects fenced code block delimiters `/^( {0,3})(`{3,}|~{3,})(.*)$/`, capturing indentation, marker run, and remainder for the fence state machine.
- `MAX_NOTE_LENGTH`: Amplenote's `200000`-character per-write cap.
- `COLLAPSE_COMMENT`: Standard comment token inserted for collapsed headers.

### 3. Pure Markdown Transformer (`lib/markdown.js`)
Pure string transformer containing zero side effects and zero `app.*` dependencies:
- **Fence State Machine**: Tracks the open fence's marker character and length. A closing fence must use the same character, be at least as long, and carry no info string — so a ```` ```` ```` block containing ``` lines (or `~~~` inside a ``` block) is never closed early. Code comments inside blocks are strictly immune from header parsing.
- **O(1) Level Lookups**: Converts `targetLevels` into a `Set` once at function entry (`targetSet.has(level)`).
- **Per-Line Line-Ending Preservation**: Splits on `(\r\n|\n|\r)` capturing the separators so LF, CRLF, and even mixed endings survive untouched.
- **Indented Headings**: Recognizes ATX headings with up to three leading spaces; four-space indentation is treated as code.
- **Non-Destructive Annotation Handling**: Appends/strips collapse annotations on the original line, preserving internal spacing and indentation. Any existing `true`/`false` annotation is normalized/stripped via `COLLAPSE_TAG_GLOBAL_REGEX`; already-collapsed lines are returned byte-identical (idempotent).
- **Input Guard**: Returns `""` for non-string or empty input.

### 4. Amplenote API Client (`lib/api.js`)
Encapsulates all interactions with the host Amplenote environment:
- `promptInitialAction(app)`: Displays the Stage 1 dialog, coerces the response to a number, and validates it against `ACTION_OPTIONS`.
- `promptAdvancedOptions(app)`: Displays the Stage 2 multi-input dialog, rejects short/partial result arrays, coerces the action value, parses checkboxes into numeric levels, and alerts the user if no levels are selected.
- `fetchNoteContent(app, noteUUID)`: Retrieves note markdown with error checking.
- `updateNoteContent(app, noteUUID, content)`: Replaces note markdown, enforces the `MAX_NOTE_LENGTH` cap before writing, and returns the host's success boolean (`false` only when `replaceNoteContent` explicitly reports the write was not performed).

---

## Build System & Verification
- **Bundler**: `esbuild` via `node esbuild.js 13`.
- **Packaging Format**: IIFE wrapper returning the plugin object (`(() => { ... return header_collapse_default;\n})()`).
- **Dependencies**: 0 external runtime dependencies.
- **Test Runner**: Jest via `$env:NODE_OPTIONS="--experimental-vm-modules"; npx jest "anp-13-header-collapse/test"`.
