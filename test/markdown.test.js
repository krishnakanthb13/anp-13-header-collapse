import { processMarkdown } from "../lib/markdown.js";
import { COLLAPSE_COMMENT } from "../lib/constants.js";

describe("processMarkdown", () => {
  describe("Collapsing headers (shouldCollapse = true)", () => {
    test("collapses standard H1, H2, and H3 headers by default", () => {
      const input = "# Heading 1\n## Heading 2\n### Heading 3";
      const expected = `# Heading 1 ${COLLAPSE_COMMENT}\n## Heading 2 ${COLLAPSE_COMMENT}\n### Heading 3 ${COLLAPSE_COMMENT}`;
      expect(processMarkdown(input, true)).toBe(expected);
    });

    test("collapses headers containing emojis", () => {
      const input = "# 🚀 Launch Plan\n## 💡 Feature Ideas";
      const expected = `# 🚀 Launch Plan ${COLLAPSE_COMMENT}\n## 💡 Feature Ideas ${COLLAPSE_COMMENT}`;
      expect(processMarkdown(input, true)).toBe(expected);
    });

    test("collapses headers containing formatting (bold, italic, code, links)", () => {
      const input = "## **Bold Section** and *Italic*\n### `code_function()` and [Docs](https://amplenote.com)";
      const expected = `## **Bold Section** and *Italic* ${COLLAPSE_COMMENT}\n### \`code_function()\` and [Docs](https://amplenote.com) ${COLLAPSE_COMMENT}`;
      expect(processMarkdown(input, true)).toBe(expected);
    });

    test("does NOT modify comments inside fenced code blocks", () => {
      const input = "```python\n# This is a python comment\ndef test():\n    # another comment\n    pass\n```\n# Actual Header";
      const expected = `\`\`\`python\n# This is a python comment\ndef test():\n    # another comment\n    pass\n\`\`\`\n# Actual Header ${COLLAPSE_COMMENT}`;
      expect(processMarkdown(input, true)).toBe(expected);
    });

    test("does NOT duplicate collapse tags if already collapsed (handles whitespace in JSON)", () => {
      const input = '# Header 1 <!-- {"collapsed": true} -->\n# Header 2 <!--{"collapsed":true}-->';
      expect(processMarkdown(input, true)).toBe(input);
    });

    test("handles empty headings cleanly", () => {
      const input = "# ";
      expect(processMarkdown(input, true)).toBe(`# ${COLLAPSE_COMMENT}`);
    });

    test("ignores lines with 7+ hashes (not valid markdown headers)", () => {
      const input = "####### Not a header";
      expect(processMarkdown(input, true)).toBe(input);
    });
  });

  describe("Expanding headers (shouldCollapse = false)", () => {
    test("expands previously collapsed headers", () => {
      const input = `# Heading 1 ${COLLAPSE_COMMENT}\n## Heading 2 ${COLLAPSE_COMMENT}`;
      const expected = "# Heading 1\n## Heading 2";
      expect(processMarkdown(input, false)).toBe(expected);
    });

    test("expands headers with variations in JSON whitespace", () => {
      const input = '# Header <!-- {"collapsed": true} -->\n## Subheader <!-- { "collapsed" : true } -->';
      const expected = "# Header\n## Subheader";
      expect(processMarkdown(input, false)).toBe(expected);
    });

    test("does NOT modify code blocks during expansion", () => {
      const input = "```ruby\n# Ruby comment\n```";
      expect(processMarkdown(input, false)).toBe(input);
    });
  });

  describe("Selective header level targeting (targetLevels parameter)", () => {
    const input = "# H1 Heading\n## H2 Heading\n### H3 Heading\n#### H4 Heading";

    test("collapses ONLY H1 when targetLevels = [1]", () => {
      const expected = `# H1 Heading ${COLLAPSE_COMMENT}\n## H2 Heading\n### H3 Heading\n#### H4 Heading`;
      expect(processMarkdown(input, true, [1])).toBe(expected);
    });

    test("collapses ONLY H2 and H3 when targetLevels = [2, 3]", () => {
      const expected = `# H1 Heading\n## H2 Heading ${COLLAPSE_COMMENT}\n### H3 Heading ${COLLAPSE_COMMENT}\n#### H4 Heading`;
      expect(processMarkdown(input, true, [2, 3])).toBe(expected);
    });

    test("expands ONLY H1 when targetLevels = [1]", () => {
      const collapsedInput = `# H1 Heading ${COLLAPSE_COMMENT}\n## H2 Heading ${COLLAPSE_COMMENT}\n### H3 Heading ${COLLAPSE_COMMENT}`;
      const expected = `# H1 Heading\n## H2 Heading ${COLLAPSE_COMMENT}\n### H3 Heading ${COLLAPSE_COMMENT}`;
      expect(processMarkdown(collapsedInput, false, [1])).toBe(expected);
    });

    test("leaves other header levels completely untouched", () => {
      const mixedInput = `# H1\n## H2 ${COLLAPSE_COMMENT}\n### H3`;
      // Expand only H3 (which is already expanded): should do nothing
      expect(processMarkdown(mixedInput, false, [3])).toBe(mixedInput);
    });
  });

  describe("Edge cases & safety", () => {
    test("handles null, undefined, or empty string gracefully", () => {
      expect(processMarkdown(null, true)).toBe("");
      expect(processMarkdown(undefined, false)).toBe("");
      expect(processMarkdown("", true)).toBe("");
    });

    test("preserves CRLF line endings", () => {
      const input = "# Header 1\r\n## Header 2";
      const result = processMarkdown(input, true);
      expect(result).toContain("\r\n");
      expect(result).toBe(`# Header 1 ${COLLAPSE_COMMENT}\r\n## Header 2 ${COLLAPSE_COMMENT}`);
    });
  });
});
