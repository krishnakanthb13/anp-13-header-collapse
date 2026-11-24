# Header Collapse Plugin for Amplenote

A high-performance Amplenote plugin that allows you to easily collapse or expand all headers across a note with a single click, or selectively target specific header levels (H1, H2, H3, or H4–H6).

Designed with robust safety mechanisms to protect code block comments, preserve emojis and rich formatting, and prevent redundant note revisions.

👉 **[Install Header Collapse Plugin (1-Click Install)](https://www.amplenote.com/plugins/ZH9S9xFfNBeoHbhJJMuKMJ2x)**  
🎥 **Video Walkthrough**: Watch the full tutorial on YouTube: [https://youtu.be/5q-9MK6RdQY](https://youtu.be/5q-9MK6RdQY)

---

## Installation

### Method 1: 1-Click Install (Recommended)
Add **Header Collapse** directly to your Amplenote workspace with one click:  
👉 **[Install Header Collapse from Amplenote Plugins Directory](https://www.amplenote.com/plugins/ZH9S9xFfNBeoHbhJJMuKMJ2x)**

---

### Method 2: Manual Installation (Developer / Self-Hosted)

#### 1. Create a Plugin Note
In Amplenote, create a new note (for example, named `Header Collapse Plugin`).

#### 2. Setup Metadata Table
At the very top of the note, create a table with the following rows:

| Field | Value |
| :--- | :--- |
| `name` | Header Collapse |
| `description` | Automatically collapse or expand all headers or selective header levels (H1, H2, H3, H4+) in a note. |
| `icon` | `unfold_less` |
| `instructions` | Open any note, click the note options menu (three dots in the top right), and select "Header Collapse". Choose "Collapse All", "Expand All", or "Advanced..." to target specific header levels. |

> *Note: This plugin does not require any manual settings rows.*

#### 3. Insert Code Block
Below the table, create a single JavaScript code block by typing:
````markdown
```javascript
```
````

#### 4. Paste Compiled Code
Copy the full contents of [`build/header-collapse.compiled.js`](build/header-collapse.compiled.js) and paste it inside that code block.

#### 5. Activate
1. Open **Account Settings** -> **Plugins**.
2. Select the note you just created to enable it across your workspace.

---

## Usage

Once installed, **Header Collapse** is available directly in the note options menu of any note.

### How to Run
1. Open any note in Amplenote.
2. Click the note menu (**`...`** in the top-right corner).
3. Select **Header Collapse**.

### Stage 1: Quick Action Dialog
A prompt will appear with three straightforward choices:

- **Collapse All**: Immediately collapses all headers (H1 through H6) in the note.
- **Expand All**: Immediately unfolds and expands all collapsed headers in the note.
- **Advanced...**: Opens Stage 2 to configure selective header levels.

### Stage 2: Advanced Level Targeting Dialog
When choosing **Advanced...**, you can fine-tune exactly what to modify:

1. **Action**: Choose whether to **Collapse** or **Expand**.
2. **Target Levels**:
   - `[x] Include H1 (#)`
   - `[x] Include H2 (##)`
   - `[x] Include H3 (###)`
   - `[ ] Include H4–H6 (####+)`

Only the checked levels will be modified. All other sections and untargeted headings remain untouched.

---

## Key Features & Safety Architecture

- 🛡️ **Fenced Code Block Protection**: Programming comments (e.g., `# comment` in Python, Ruby, Shell, R, Elixir) inside ```` ``` ```` or `~~~` blocks are strictly ignored and never modified.
- 🎨 **Formatting & Emoji Friendly**: Headers containing emojis (`# 🚀 Launch`), inline formatting (`**bold**`, `*italic*`, `` `code` ``), or links (`[Docs](url)`) are preserved intact.
- 🔄 **Whitespace Tolerance**: Detects Amplenote collapse comment tags regardless of JSON spacing variations (`<!-- {"collapsed":true} -->` or `<!-- {"collapsed": true} -->`), eliminating duplicate tags.
- ⚡ **Performance Optimized**: Compares note content before writing. If no headers were changed (e.g. note was already collapsed/expanded), the API write is skipped to prevent unnecessary note revisions and sync traffic.
- 🖥️ **Cross-Platform CRLF Safety**: Maintains native Windows line endings (`\r\n`) without altering document formatting.

---

## Technical Architecture

The plugin is structured as modular ES modules under `lib/`, compiled into a standalone, dependency-free IIFE for Amplenote:

```
anp-13-header-collapse/
├── header-collapse.js                 ← Entry point (orchestrator, ~50 lines)
├── lib/
│   ├── constants.js                   ← Enums, regex patterns, and prompt configurations
│   ├── markdown.js                    ← Pure markdown line-by-line parser and transformer
│   └── api.js                         ← Amplenote app.* wrappers (prompts, alerts, note I/O)
├── build/
│   └── header-collapse.compiled.js    ← Distribution bundle (IIFE wrapped, zero dependencies)
├── test/
│   ├── markdown.test.js               ← Unit & regression tests for markdown processing (25 tests)
│   ├── api.test.js                    ← Mocks & tests for Amplenote API wrappers (21 tests)
│   └── header-collapse.test.js        ← End-to-end plugin orchestrator tests (8 tests)
└── README.md                          ← Plugin documentation
```

### Build Command
Compile the modular source into the production bundle using the project's root bundler:
```bash
node esbuild.js 13
```

### Running Tests
Execute the full Jest test suite (54 unit, edge case, and regression tests):
```bash
$env:NODE_OPTIONS="--experimental-vm-modules"; npx jest "anp-13-header-collapse/test" --verbose
```

---

## License
MIT
