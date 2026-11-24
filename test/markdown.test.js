import { processMarkdown } from "../lib/markdown.js";
import { COLLAPSE_COMMENT } from "../lib/constants.js";

describe("markdown.js — processMarkdown", () => {
  describe("Happy Path", () => {
    test("collapses standard H1, H2, and H3 headers by default", () => {
      const input = "# Heading 1\n## Heading 2\n### Heading 3";
      const expected = `# Heading 1 ${COLLAPSE_COMMENT}\n## Heading 2 ${COLLAPSE_COMMENT}\n### Heading 3 ${COLLAPSE_COMMENT}`;
      expect(processMarkdown(input, true)).toBe(expected);
    });

    test("expands previously collapsed headers", () => {
      const input = `# Heading 1 ${COLLAPSE_COMMENT}\n## Heading 2 ${COLLAPSE_COMMENT}`;
      const expected = "# Heading 1\n## Heading 2";
      expect(processMarkdown(input, false)).toBe(expected);
    });

    test("collapses headers containing emojis", () => {
      const input = "# 🚀 Launch Plan\n## 💡 Feature Ideas";
      const expected = `# 🚀 Launch Plan ${COLLAPSE_COMMENT}\n## 💡 Feature Ideas ${COLLAPSE_COMMENT}`;
      expect(processMarkdown(input, true)).toBe(expected);
    });

    test("collapses headers containing rich formatting (bold, italic, code, links)", () => {
      const input = "## **Bold Section** and *Italic*\n### `code_function()` and [Docs](https://amplenote.com)";
      const expected = `## **Bold Section** and *Italic* ${COLLAPSE_COMMENT}\n### \`code_function()\` and [Docs](https://amplenote.com) ${COLLAPSE_COMMENT}`;
      expect(processMarkdown(input, true)).toBe(expected);
    });

    test("handles full notes with mixed paragraphs, lists, and headers", () => {
      const input = "# Main Title\n\nIntroduction paragraph.\n\n- Bullet 1\n- Bullet 2\n\n## Subtitle\n\nConclusion.";
      const expected = `# Main Title ${COLLAPSE_COMMENT}\n\nIntroduction paragraph.\n\n- Bullet 1\n- Bullet 2\n\n## Subtitle ${COLLAPSE_COMMENT}\n\nConclusion.`;
      expect(processMarkdown(input, true)).toBe(expected);
    });

    test("collapses ONLY H1 when targetLevels = [1]", () => {
      const input = "# H1 Heading\n## H2 Heading\n### H3 Heading";
      const expected = `# H1 Heading ${COLLAPSE_COMMENT}\n## H2 Heading\n### H3 Heading`;
      expect(processMarkdown(input, true, [1])).toBe(expected);
    });

    test("collapses ONLY H2 and H3 when targetLevels = [2, 3]", () => {
      const input = "# H1 Heading\n## H2 Heading\n### H3 Heading\n#### H4 Heading";
      const expected = `# H1 Heading\n## H2 Heading ${COLLAPSE_COMMENT}\n### H3 Heading ${COLLAPSE_COMMENT}\n#### H4 Heading`;
      expect(processMarkdown(input, true, [2, 3])).toBe(expected);
    });

    test("expands ONLY H1 when targetLevels = [1]", () => {
      const input = `# H1 Heading ${COLLAPSE_COMMENT}\n## H2 Heading ${COLLAPSE_COMMENT}\n### H3 Heading ${COLLAPSE_COMMENT}`;
      const expected = `# H1 Heading\n## H2 Heading ${COLLAPSE_COMMENT}\n### H3 Heading ${COLLAPSE_COMMENT}`;
      expect(processMarkdown(input, false, [1])).toBe(expected);
    });
  });

  describe("Edge Cases", () => {
    test("handles empty headings cleanly", () => {
      const input = "# ";
      expect(processMarkdown(input, true)).toBe(`# ${COLLAPSE_COMMENT}`);
    });

    test("handles header hashes without trailing space/content", () => {
      const input = "###";
      expect(processMarkdown(input, true)).toBe(`### ${COLLAPSE_COMMENT}`);
      expect(processMarkdown(`### ${COLLAPSE_COMMENT}`, false)).toBe("###");
    });

    test("ignores lines with 7+ hashes (not valid markdown headers)", () => {
      const input = "####### Not a header";
      expect(processMarkdown(input, true)).toBe(input);
    });

    test("preserves CRLF (\\r\\n) line endings throughout note", () => {
      const input = "# Header 1\r\n## Header 2";
      const result = processMarkdown(input, true);
      expect(result).toContain("\r\n");
      expect(result).toBe(`# Header 1 ${COLLAPSE_COMMENT}\r\n## Header 2 ${COLLAPSE_COMMENT}`);
    });

    test("leaves untargeted header levels completely untouched", () => {
      const input = `# H1\n## H2 ${COLLAPSE_COMMENT}\n### H3`;
      expect(processMarkdown(input, false, [3])).toBe(input);
    });

    test("collapses and expands headings indented by up to three spaces", () => {
      const input = "   # Indented H1\n    ## Four-space is not a heading";
      const collapsed = `   # Indented H1 ${COLLAPSE_COMMENT}\n    ## Four-space is not a heading`;
      expect(processMarkdown(input, true)).toBe(collapsed);
      expect(processMarkdown(collapsed, false)).toBe(input);
    });

    test("preserves internal spacing of headings it modifies", () => {
      const input = "##    Heading with gaps";
      expect(processMarkdown(input, true)).toBe(`##    Heading with gaps ${COLLAPSE_COMMENT}`);
    });

    test("normalizes a stale collapsed:false annotation instead of duplicating it", () => {
      const input = '## Section <!-- {"collapsed": false} -->';
      expect(processMarkdown(input, true)).toBe(`## Section ${COLLAPSE_COMMENT}`);
    });

    test("expands headings carrying collapsed:false annotations", () => {
      const input = '## Section <!-- {"collapsed": false} -->';
      expect(processMarkdown(input, false)).toBe("## Section");
    });

    test("preserves mixed line endings per line", () => {
      const input = "# A\n## B\r\n### C";
      expect(processMarkdown(input, true)).toBe(
        `# A ${COLLAPSE_COMMENT}\n## B ${COLLAPSE_COMMENT}\r\n### C ${COLLAPSE_COMMENT}`
      );
    });
  });

  describe("Error Handling & Input Guards", () => {
    test("handles null input gracefully", () => {
      expect(processMarkdown(null, true)).toBe("");
    });

    test("handles undefined input gracefully", () => {
      expect(processMarkdown(undefined, false)).toBe("");
    });

    test("handles empty string gracefully", () => {
      expect(processMarkdown("", true)).toBe("");
    });

    test("returns an empty string for non-string input without throwing", () => {
      expect(processMarkdown(12345, true)).toBe("");
      expect(processMarkdown({}, false)).toBe("");
    });
  });

  describe("Regression Checks", () => {
    test("does NOT modify comments inside fenced code blocks during collapse", () => {
      const input = "```python\n# This is a python comment\ndef test():\n    # another comment\n    pass\n```\n# Actual Header";
      const expected = `\`\`\`python\n# This is a python comment\ndef test():\n    # another comment\n    pass\n\`\`\`\n# Actual Header ${COLLAPSE_COMMENT}`;
      expect(processMarkdown(input, true)).toBe(expected);
    });

    test("does NOT modify code blocks during expansion", () => {
      const input = "```ruby\n# Ruby comment\n```";
      expect(processMarkdown(input, false)).toBe(input);
    });

    test("handles tilde fenced code blocks (~~~)", () => {
      const input = "~~~\n# Bash comment\necho 'hello'\n~~~\n## Header";
      const expected = `~~~\n# Bash comment\necho 'hello'\n~~~\n## Header ${COLLAPSE_COMMENT}`;
      expect(processMarkdown(input, true)).toBe(expected);
    });

    test("does not close a four-backtick block on inner triple-backtick lines", () => {
      const input = [
        "````markdown",
        "# inside four-backtick block should stay",
        "```",
        "# still inside",
        "```",
        "````",
        "# Real Header"
      ].join("\n");
      const expected = [
        "````markdown",
        "# inside four-backtick block should stay",
        "```",
        "# still inside",
        "```",
        "````",
        `# Real Header ${COLLAPSE_COMMENT}`
      ].join("\n");
      expect(processMarkdown(input, true)).toBe(expected);
    });

    test("does not treat a different fence character as a closing fence", () => {
      const input = "```\n~~~\n# inside\n```\n# Real Header";
      const expected = `\`\`\`\n~~~\n# inside\n\`\`\`\n# Real Header ${COLLAPSE_COMMENT}`;
      expect(processMarkdown(input, true)).toBe(expected);
    });

    test("does NOT duplicate collapse tags if already collapsed (handles whitespace variations)", () => {
      const input = '# Header 1 <!-- {"collapsed": true} -->\n# Header 2 <!--{"collapsed":true}-->';
      expect(processMarkdown(input, true)).toBe(input);
    });

    test("expands headers with variations in JSON whitespace", () => {
      const input = '# Header <!-- {"collapsed": true} -->\n## Subheader <!-- { "collapsed" : true } -->';
      const expected = "# Header\n## Subheader";
      expect(processMarkdown(input, false)).toBe(expected);
    });
  });
});
