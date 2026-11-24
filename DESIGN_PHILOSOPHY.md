# Design Philosophy — Header Collapse Plugin (`anp-13-header-collapse`)

## Core Ideology

### 1. Progressive Disclosure Over Menu Clutter
Amplenote's note options menu is crowded with system utilities (Share, Publish, Revision History, Word Count). Rather than fragmenting into multiple menu entries, **Header Collapse** provides a single, clean menu entry that uses progressive disclosure:
- **90% Use Case**: Users who simply want to "Collapse All" or "Expand All" achieve it in 1 quick click.
- **Power User Case**: Users needing fine-grained control can choose "Advanced..." to open selective level checkboxes.

### 2. Code Block Immunity
In technical notes, code blocks frequently contain comments starting with `#` (Python, Ruby, Shell, R, Elixir):
```python
# Initialize database
db = connect()
```
A naive line-by-line regex would treat `# Initialize database` as an H1 header and inject HTML comments into the user's code. Our parser runs a fence state machine that remembers the opening marker's character **and** length, so nested or longer fences are honored: a ```` ```` ```` block containing ``` lines, or a `~~~` line inside a ``` block, never closes the block early. Code snippets stay 100% immune from modification.

### 3. Non-Destructive Parsing & Idempotency
Users frequently re-collapse or re-expand notes, or format them with external markdown tools. 
- The parser accepts JSON spacing variations (`<!-- {"collapsed": true} -->` vs `<!-- {"collapsed":true} -->`).
- A stale `<!-- {"collapsed": false} -->` annotation is normalized to the canonical `true` on collapse rather than duplicated.
- The annotation is added/removed on the original line, so internal heading spacing and indentation (and headings indented up to three spaces) are preserved.
- Expanding headers strips **only** the collapse comment, preserving all emojis, bold text, italics, code snippets, links, and surrounding whitespace.
- Running collapse twice produces identical output without duplicating tags.

### 4. Redundant Revision Prevention
Amplenote records note history on content updates. Rewriting an already-collapsed note clutters revision history and consumes unnecessary sync bandwidth. By verifying `modifiedMarkdown !== markdown` prior to calling `app.replaceNoteContent`, the plugin eliminates no-op writes. When a write does happen, the host's boolean result is checked and, because some Amplenote versions return `false` even on success, confirmed by a read-back — so a genuine failure is logged without ever raising a spurious error.

### 5. 100% Offline & Zero-Exfiltration Privacy
Notes are deeply personal knowledge repositories. **Header Collapse** adheres strictly to zero-exfiltration principles:
- **Zero external network requests**: No `fetch()`, `XMLHttpRequest`, or WebSockets.
- **Zero telemetry or analytics**.
- **Self-contained execution**: All operations run locally inside the Amplenote JavaScript runtime.
