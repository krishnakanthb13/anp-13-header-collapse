# Social Media Release Drafts: Header Collapse

## Released: Header Collapse v0.0.5 (2026-11-24)

### LinkedIn

Excited to announce the official release of Header Collapse v0.0.5 for Amplenote! 📑🚀

Long-form notes, project roadmaps, and meeting logs can become overwhelming to navigate as they grow. While Amplenote supports collapsing headers, toggling them individually on long notes takes unnecessary time.

Header Collapse solves this by providing instant note-wide header management directly from the note menu:

⚡ 1-Click Fast Actions: Instantly Collapse All or Expand All headers throughout an entire note in a single click.

🎯 Granular Header Level Targeting: With the new "Advanced..." dialog, you can choose to collapse or expand only specific levels (e.g. collapse only H1s for a high-level executive view, or collapse H3s to tidy up granular details while keeping main chapters open).

🛡️ Code Block Immunity: Protects your scripts and technical notes. Lines starting with # comments inside Python, Ruby, Shell, or Bash code blocks are strictly protected from modification.

🎨 Formatting & Emoji Friendly: Preserves all rich text styling, bold/italics, links, and native emojis without stripping or corrupting characters.

⚡ Performance Optimized: Compares content before writing. If no headers changed, network saves are skipped to keep your note revision history clean.

🔒 100% Offline & Zero-Exfiltration: Zero external dependencies, zero network requests, and zero telemetry. Note content never leaves your local client.

1-Click Install in Amplenote:
https://www.amplenote.com/plugins/ZH9S9xFfNBeoHbhJJMuKMJ2x

Watch the full video walkthrough:
https://youtu.be/5q-9MK6RdQY

Full open-source repository, documentation, and test suite (54 passing Jest tests):
https://github.com/krishnakanthb13/anp-13-header-collapse

#Amplenote #Productivity #PKM #OpenSource #SoftwareEngineering #WebDev #JavaScript #Markdown #NoteTaking

---

### Twitter / X

Header Collapse v0.0.5 for @amplenote is out! 📑✨

Collapse or expand all headers in 1 click, or target specific levels (H1, H2, H3) with the new Advanced modal.

Install: https://www.amplenote.com/plugins/ZH9S9xFfNBeoHbhJJMuKMJ2x
Watch: https://youtu.be/5q-9MK6RdQY
Repo: https://github.com/krishnakanthb13/anp-13-header-collapse

#Amplenote

---

### Bluesky

Header Collapse v0.0.5 for Amplenote is live! 📑✨

Take control of long notes and research documents:
• 1-click Collapse All / Expand All
• Advanced targeting: select H1, H2, H3, or H4+
• Code-block comment protection (# python/bash)
• 100% offline with zero dependencies

Install: https://www.amplenote.com/plugins/ZH9S9xFfNBeoHbhJJMuKMJ2x
Video: https://youtu.be/5q-9MK6RdQY
Repo: https://github.com/krishnakanthb13/anp-13-header-collapse

---

### Mastodon

Header Collapse v0.0.5 for #Amplenote is now available! 📑🚀

Tidy up long-form research, meeting notes, and project plans in seconds:
• Fast 1-click Collapse All & Expand All
• Advanced dialog for selective header targeting (H1, H2, H3, or H4–H6)
• Full code block comment immunity (never modifies `# comments` in code)
• Preserves all emojis, rich formatting, and Windows CRLF line endings
• 100% offline with zero external network dependencies and 54 passing Jest tests

Install: https://www.amplenote.com/plugins/ZH9S9xFfNBeoHbhJJMuKMJ2x
Video: https://youtu.be/5q-9MK6RdQY
Full source & documentation:
https://github.com/krishnakanthb13/anp-13-header-collapse

#PKM #Productivity #OpenSource #JavaScript #WebDev

---

### Reddit

**Suggested Subreddits:** `r/Amplenote`, `r/Productivity`, `r/PKM`, `r/NoteTaking`, `r/webdev`, `r/javascript`  
**Suggested Title:** [Plugin Release] Header Collapse v0.0.5 for Amplenote: 1-click Collapse/Expand with selective header levels & code block protection

Hey everyone!

I just released v0.0.5 of **Header Collapse**, an open-source plugin for Amplenote designed to tame long notes and outline hierarchies.

### The Problem
When working with comprehensive notes, outlines, or sprint plans, navigating deep heading hierarchies can get tedious. While you can fold headers manually one by one, there wasn't a quick way to fold or unfold all headers across the document at once, or collapse only high-level sections.

### What it Does
- **1-Click Collapse All & Expand All**: Instantly folds or unfolds every heading in your note.
- **Advanced Mode**: Lets you selectively target specific levels (e.g. collapse only H1s to create an executive summary view, or collapse H3s to keep major sections open).
- **Code Block Immunity**: Uses state-machine line tracking to ensure `#` comments inside Python, Bash, Ruby, or other fenced code blocks are never mistaken for Markdown headers.
- **Idempotent & Safe**: Tolerates JSON spacing variations (`<!-- {"collapsed": true} -->`), preserves native emojis, bold/italic syntax, and skips API writes if content is already in the target state (keeping note revision history clean).
- **Zero Runtime Dependencies**: Bundled into a clean, standalone IIFE. 100% client-side with zero network requests.

The plugin comes with 54 Jest tests covering happy paths, edge cases, input guards, and regressions.

Install the plugin directly:
https://www.amplenote.com/plugins/ZH9S9xFfNBeoHbhJJMuKMJ2x

Watch the video walkthrough:
https://youtu.be/5q-9MK6RdQY

Check out the repo and setup guide here:
https://github.com/krishnakanthb13/anp-13-header-collapse

Feedback and PRs are always welcome!
