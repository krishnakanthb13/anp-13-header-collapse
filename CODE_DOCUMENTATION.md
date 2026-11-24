# Code Documentation — Header Collapse Plugin (`anp-13-header-collapse`)

## Overview
The **Header Collapse Plugin** enables users to quickly collapse or expand all headers across an Amplenote note, or selectively target specific header levels (H1, H2, H3, H4–H6). It is built as a set of modular ES modules that compile into a self-executing IIFE for injection into an Amplenote plugin note.

---

## Architecture & Module Breakdown

```
anp-13-header-collapse/
├── header-collapse.js                 ← Entry point (orchestrator, ~50 lines)
├── lib/
│   ├── constants.js                   ← Declarative enums, regexes, and dialog schemas
│   ├── markdown.js                    ← Pure markdown line-by-line parser and transformer
│   └── api.js                         ← Amplenote app.* wrappers with validation and guards
├── build/
│   └── header-collapse.compiled.js    ← Production bundle (IIFE wrapped, zero dependencies)
└── test/
    ├── markdown.test.js               ← 25 unit and regression tests for markdown processing
    ├── api.test.js                    ← 21 tests for Amplenote API dialogs and note I/O
    └── header-collapse.test.js        ← 8 tests for end-to-end orchestration and edge cases
```

---

## Core Modules

### 1. Plugin Orchestrator (`header-collapse.js`)
The central entry point implementing Amplenote's `noteOption(app, noteUUID)` action:
- **Two-Stage Execution**:
  - Stage 1 invokes `promptInitialAction` to present standard choices (Collapse All, Expand All, Advanced...).
  - If "Advanced..." is chosen, Stage 2 invokes `promptAdvancedOptions` to extract user-selected header levels.
- **Redundant Revision Prevention**:
  - Compares the transformed content against the original note: `if (modifiedMarkdown !== markdown)`.
  - If no headers changed (e.g. note was already collapsed/expanded), the API write is skipped, avoiding unnecessary sync events and revision history clutter.
- **Error Boundaries**:
  - Guards against missing `app` or `noteUUID`.
  - Wraps execution in `try/catch`, alerting the user if a runtime error occurs.

### 2. Declarative Constants & Configs (`lib/constants.js`)
Isolates all magic numbers, configuration objects, regex patterns, and UI copy:
- `ACTION_OPTIONS`: Enum for Stage 1 prompt (`COLLAPSE_ALL: 1`, `EXPAND_ALL: 2`, `ADVANCED: 3`).
- `ADVANCED_ACTION`: Enum for Stage 2 prompt (`COLLAPSE: 1`, `EXPAND: 2`).
- `ALL_HEADER_LEVELS`: Immutable array `[1, 2, 3, 4, 5, 6]`.
- `HEADER_PATTERN`: Strict bounded regex `/^(#{1,6})(?:\s+(.*?)|$)\s*$/` validating H1–H6.
- `COLLAPSE_TAG_REGEX` & `COLLAPSE_TAG_GLOBAL_REGEX`: Tolerant matching for Amplenote collapse comment tags (`<!-- {"collapsed":true} -->` and whitespace variants).
- `CODE_BLOCK_FENCE_REGEX`: Detects code block fences (`/^\s*(```|~~~)/`).
- `COLLAPSE_COMMENT`: Standard comment token inserted for collapsed headers.

### 3. Pure Markdown Transformer (`lib/markdown.js`)
Pure string transformer containing zero side effects and zero `app.*` dependencies:
- **Fenced Code Block Tracking**: Maintains an `inCodeBlock` state toggled by fenced code block fences. Code comments (e.g. `# python comment`) inside blocks are strictly immune from header parsing.
- **O(1) Level Lookups**: Converts `targetLevels` into a `Set` once at function entry (`targetSet.has(level)`).
- **CRLF Line-Ending Preservation**: Automatically detects `\r\n` line endings and preserves them during line join operations.
- **Whitespace Tolerance**: Removes existing tags using `COLLAPSE_TAG_GLOBAL_REGEX`, preventing duplicate tags upon re-collapsing.

### 4. Amplenote API Client (`lib/api.js`)
Encapsulates all interactions with the host Amplenote environment:
- `promptInitialAction(app)`: Displays the Stage 1 dialog and validates the response against `ACTION_OPTIONS`.
- `promptAdvancedOptions(app)`: Displays the Stage 2 multi-input dialog, parses checkboxes into numeric levels, and alerts the user if no levels are selected.
- `fetchNoteContent(app, noteUUID)`: Retrieves note markdown with error checking.
- `updateNoteContent(app, noteUUID, content)`: Replaces note markdown with error checking.

---

## Build System & Verification
- **Bundler**: `esbuild` via `node esbuild.js 13`.
- **Packaging Format**: IIFE wrapper returning the plugin object (`(() => { ... return header_collapse_default;\n})()`).
- **Dependencies**: 0 external runtime dependencies.
- **Test Runner**: Jest via `$env:NODE_OPTIONS="--experimental-vm-modules"; npx jest "anp-13-header-collapse/test"`.
