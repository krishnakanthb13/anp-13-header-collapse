# YouTube Video Preparation (PREP.md)

This document contains packaging metadata, a Gemini 3.8 Flash TTS Director Prompt, an end-user walkthrough script, and a technical maintainer overview for the **Header Collapse Plugin** (`anp-13-header-collapse`) in Amplenote.

---

## 1. Packaging Metadata

### Title Options
* **Option A (Clear & Direct):** How to Use the Header Collapse Plugin in Amplenote
* **Option B (Benefit-driven):** Master Note Outlines: Instant 1-Click Header Collapse & Expand in Amplenote!
* **Install URL:** https://www.amplenote.com/plugins/ZH9S9xFfNBeoHbhJJMuKMJ2x
* **Video URL:** https://youtu.be/5q-9MK6RdQY

### Thumbnail Plan
- **Background:** Solid Amplenote dark mode tone (`#1E1E1E`).
- **Text Formatting:**
  - **"AMPLENOTE PLUGIN:"** in uppercase vibrant Amplenote blue (`#007AFF`), centered.
  - **"HEADER COLLAPSE"** immediately below in stark white, extra-large, ultra-bold typography.
  - Subtitle badge: *"1-Click Collapse All & Selective Levels"* in light gray pill container.
- **Visual Elements:** A visual collapsible arrow caret icon toggling in the center, with the official Amplenote logo positioned cleanly in the bottom right corner.

### Description

📑 COMPLETE GUIDE TO THE HEADER COLLAPSE PLUGIN FOR AMPLENOTE

A straightforward, fact-based walkthrough of the Header Collapse plugin for Amplenote. When managing long-form research, meeting logs, and deep outline hierarchies, folding headers one by one takes unnecessary time. 

Header Collapse gives you effortless document navigation right from your note menu. With a single click, you can Collapse All or Expand All headers throughout your note, or open Advanced Mode to target specific heading levels—like collapsing only H1s for a high-level executive summary, or collapsing H3s to tidy up granular details while keeping main chapters open.

Built with complete code-block immunity, your Python, Ruby, and Bash `#` comments are never touched. Emojis, bold text, links, and Windows line endings are 100% preserved.

🔗 ESSENTIAL LINKS & RESOURCES
* Official 1-Click Install: https://www.amplenote.com/plugins/ZH9S9xFfNBeoHbhJJMuKMJ2x
* Watch Video: https://youtu.be/5q-9MK6RdQY
* GitHub Repo: https://github.com/krishnakanthb13/anp-13-header-collapse
* Try Amplenote (Sign Up): https://www.amplenote.com/signup?ref=7JGSMI4H0
* Explore My Amplenote Plugins: https://krishnakanthb13.github.io/A/
* Alternative Plugins Page: https://public.amplenote.com/Y3dy91/krishna-plugins
* Browse Official Amplenote Plugins: https://www.amplenote.com/plugins
* Support My Work & Development: https://krishnakanthb13.github.io/S/

🕒 VIDEO TIMESTAMPS
0:00 - Introduction & Overview
0:34 - 1-Click Collapse All & Expand All
1:14 - Advanced Header Level Targeting (H1, H2, H3, H4+)
1:57 - Code Block Immunity & Formatting Safety
2:29 - Smart Revision Saving & Wrap-Up

📋 FEATURE BREAKDOWN

FAST 1-CLICK ACTIONS
* Collapse All: Instantly folds every heading (H1 through H6) across your entire note in one click.
* Expand All: Instantly unfolds all collapsed sections throughout the note.

ADVANCED LEVEL TARGETING
* Selective Level Controls: Target any combination of H1 (#), H2 (##), H3 (###), and H4–H6 (####+).
* Custom Views: Collapse only top-level chapters for an executive summary, or collapse sub-sections while keeping major chapters readable.
* Non-Destructive: Untargeted heading levels remain completely untouched.

CODE BLOCK IMMUNITY & FORMATTING INTEGRITY
* Code Comment Protection: Comments starting with # inside Python, Ruby, Shell, or Bash code blocks are strictly protected and never modified.
* Rich Text & Emoji Friendly: Fully preserves native emojis (🚀, 💡), bold/italic text, code snippets, and links.
* Whitespace Tolerance: Accurately identifies collapse tags regardless of JSON spacing variations, preventing duplicate tags.

SMART REVISION OPTIMIZATION
* Redundant Write Prevention: Checks note content before saving. If the document is already in the requested state, network writes are skipped to protect your note revision history.
* 100% Offline & Private: Operates entirely locally within Amplenote with zero external network requests and zero telemetry.

#Amplenote #Productivity #PKM #NoteTaking #Outlining #Organization #Markdown #OpenSource

---

## 2. Gemini 3.8 Flash TTS Director Prompt

Use this complete prompt block directly in **Google AI Studio** (Speech / Audio generation workspace) or via the **Gemini API** using `gemini-3.8-flash-tts` or `gemini-3.8-flash-lite-tts`:

```text
AUDIO PROFILE:
Voice: Professional, warm, articulate tech educator.
Accent: Crisp, neutral American accent.
Pacing: Steady, moderate educational tempo with clear articulation.

SCENE:
Setting: Quiet recording studio booth, close-mic screencast narration with clean room tone and zero echo.

DIRECTOR'S NOTES:
Maintain a conversational, factual delivery without hype. 
Pause naturally between feature transitions. 
Enunciate header levels (H-one, H-two, H-three) clearly as separate words.
Use <long pause> on a separate line between sections.
Never read raw markdown syntax or code brackets aloud.

TRANSCRIPT:
[warmly] Hello everyone! In this video, we are doing a complete walkthrough of the Header Collapse Plugin for Amplenote. When you work with long research notes, comprehensive project roadmaps, or meeting logs, navigating deep outline hierarchies can take unnecessary time. While Amplenote allows you to collapse headings individually, toggling dozens of sections manually is tedious. Header Collapse solves this by giving you instant document-wide control right from your note menu. Let's look at how it works in practice.

<long pause>

[clear enunciate] To use the plugin, open any note in Amplenote, click on the note options menu represented by the three dots in the top right corner, and select Header Collapse. This opens our quick action dialog with three straightforward choices: Collapse All, Expand All, and Advanced.

<long pause>

Selecting Collapse All immediately folds every single heading throughout your note, from H-one down through H-six. This gives you an instant high-level outline view so you can quickly scan your document structure without getting lost in the details. Conversely, selecting Expand All instantly unfolds all collapsed sections across the entire note in a single click.

<long pause>

[confident] For more granular control, choosing Advanced opens our header level selector. Here, you can select whether you want to Collapse or Expand, and check off exactly which header levels to target. You can include H-one, H-two, H-three, or H-four through H-six. For example, you can collapse only H-one headings to create an executive summary view of your main sections, or collapse only H-three sub-sections to tidy up fine details while keeping your major chapters wide open. Any heading level you leave unchecked remains completely untouched.

<long pause>

[clear enunciate] Header Collapse is built with strict safety safeguards. If you keep programming code blocks in your notes, comment lines starting with hash symbols inside Python, Ruby, or Shell scripts are completely immune from modification. The plugin also preserves native emojis, bold and italic formatting, links, and Windows line endings. In addition, it compares your note content before saving. If your headings are already in the requested state, it skips saving altogether, keeping your note revision history completely clean.

<long pause>

[warmly] That covers everything in the Header Collapse Plugin for Amplenote. It provides instant outline navigation while keeping your technical notes safe and your workspace uncluttered. You can find the open-source repository and links in the description below. Thanks for watching!
```

---

## 3. Walkthrough Script (Fact-Based & User-Focused)

### **Introduction & Overview**
> **Speaker**: "Hello everyone! In this video, we're doing a complete walkthrough of the **Header Collapse Plugin** for Amplenote.
> 
> When you work with long research notes, comprehensive project roadmaps, or meeting logs, navigating deep outline hierarchies can take unnecessary time. While Amplenote allows you to collapse headings individually, toggling dozens of sections manually is tedious.
> 
> Header Collapse solves this by giving you instant document-wide control right from your note menu. Let's look at how it works in practice."

---

### **Section 1: Accessing the Plugin & Fast 1-Click Actions**
> **Speaker**: "To use the plugin, open any note in Amplenote, click on the note options menu—the three dots in the top-right corner—and select **Header Collapse**.
> 
> This opens a clean quick-action dialog with three choices:
> - **Collapse All**
> - **Expand All**
> - **Advanced...**
> 
> **TL;DR Actions:**
> - **Collapse All**: Folds every heading throughout your note (H1 through H6) immediately. You get an instant high-level outline view to scan your document structure without getting lost in granular paragraphs.
> - **Expand All**: Unfolds all collapsed sections across your entire note in a single click."

---

### **Section 2: Advanced Header Level Targeting**
> **Speaker**: "If you don't want to collapse everything, choosing **Advanced...** opens our selective header level selector.
> 
> Here, you configure:
> 1. **Action**: Choose whether you want to **Collapse** or **Expand**.
> 2. **Target Levels**: Check off any combination of:
>    - `Include H1 (#)`
>    - `Include H2 (##)`
>    - `Include H3 (###)`
>    - `Include H4–H6 (####+)`
> 
> **TL;DR Use Cases:**
> - **Executive Summary**: Check only **H1** to collapse primary chapters, giving you a clean table of contents.
> - **Focused Writing**: Check only **H3** to tuck away granular sub-points while keeping your main sections open.
> - **Untargeted Immunity**: Any heading level left unchecked remains completely untouched."

---

### **Section 3: Formatting Integrity & Code Block Immunity**
> **Speaker**: "Header Collapse includes built-in safety mechanisms to protect your note content:
> 
> **TL;DR Safeguards:**
> - **Code Block Immunity**: If you have code snippets in your notes, comment lines starting with `#` in Python, Ruby, Bash, or Shell blocks are completely immune from modification. The plugin knows the difference between a code comment and a Markdown header.
> - **Formatting & Emojis**: Headers with emojis (like `# 🚀 Project Launch`), bold text, italics, or links are preserved intact.
> - **Whitespace Tolerance**: Accurately recognizes collapse tags even if formatted with spacing variations, preventing duplicate tags.
> - **Smart Revision Saving**: The plugin checks your content before writing. If your note is already collapsed or expanded, it skips the update completely, keeping your Amplenote note revision history clean."

---

### **Conclusion & Wrap-Up**
> **Speaker**: "That covers all the capabilities of the Header Collapse Plugin for Amplenote. It provides instant outline navigation while keeping your technical notes safe and your workspace uncluttered.
> 
> You can find the open-source repository and links in the description below. Thanks for watching!"

---

## 4. Maintainer Code Walkthrough (For Contributors & Developers)

This section is dedicated strictly to developers and maintainers looking to understand the underlying implementation, build pipeline, and test harness.

### Architecture Overview
The plugin adopts a modular ES module architecture under `lib/`, strictly separating pure string transformations from Amplenote API side effects:

1. **`header-collapse.js` (Orchestrator)**:
   - Exports the Amplenote `noteOption(app, noteUUID)` action handler.
   - Drives the two-stage modal workflow (`promptInitialAction` followed optionally by `promptAdvancedOptions`).
   - Implements performance guard: `if (modifiedMarkdown !== markdown)` skips `app.replaceNoteContent` when no changes occurred, preventing redundant sync traffic.
   - Encapsulates defensive parameter guards and error boundaries.

2. **`lib/markdown.js` (Pure Parser Engine)**:
   - Pure string transformer: `processMarkdown(markdown, shouldCollapse, targetLevels)`.
   - **Fenced Code Block State Machine**: Tracks block open/close fences (`/^\s*(```|~~~)/`) so that `#` comments inside code blocks are ignored.
   - **O(1) Level Filtering**: Converts `targetLevels` into a `Set` once at entry (`targetSet.has(level)`).
   - **CRLF Normalization**: Preserves native `\r\n` line endings without formatting degradation.

3. **`lib/constants.js` (Declarative Configs)**:
   - Action enums (`ACTION_OPTIONS`, `ADVANCED_ACTION`).
   - Strict bounded header regex: `/^(#{1,6})(?:\s+(.*?)|$)\s*$/`.
   - Tolerant collapse comment regex: `/<!--\s*\{\s*"collapsed"\s*:\s*true\s*\}\s*-->/i`.
   - Precompiled global regex (`COLLAPSE_TAG_GLOBAL_REGEX`) eliminating loop RegExp allocations.

4. **`lib/api.js` (Amplenote Client Isolation)**:
   - Isolates all `app.prompt`, `app.alert`, `app.getNoteContent`, and `app.replaceNoteContent` calls.
   - Enforces return value validation against enum sets (`VALID_INITIAL_ACTIONS`, `VALID_ADVANCED_ACTIONS`).

### Build & Distribution
- **Bundler**: `esbuild.js` compiles the entry file and `lib/` dependencies into `build/header-collapse.compiled.js`.
- **Runtime Envelope**: Self-executing IIFE returning the plugin object literal without `export default` or `module.exports`.
- **Bundle Footprint**: 7,037 bytes with zero external runtime dependencies.

### Testing & Verification
- **Test Suite**: 54 passing tests across 3 Jest suites (`markdown.test.js`, `api.test.js`, `header-collapse.test.js`).
- **Harness Command**:
  ```bash
  $env:NODE_OPTIONS="--experimental-vm-modules"; npx jest "anp-13-header-collapse/test" --verbose
  ```
- **Coverage**: Full coverage across Happy Path, Edge Cases, Error Handling, and Regression categories with a 10/10 confidence score.
