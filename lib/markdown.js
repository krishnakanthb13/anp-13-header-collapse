import {
  HEADER_PATTERN,
  COLLAPSE_TAG_REGEX,
  CODE_BLOCK_FENCE_REGEX,
  COLLAPSE_COMMENT,
  ALL_HEADER_LEVELS
} from "./constants.js";

/**
 * Process markdown content and add or remove header collapse comments.
 * Correctly ignores code blocks, handles emojis/formatting, tolerates JSON tag whitespace,
 * and selectively targets specified header levels.
 *
 * @param {string} markdown - Raw markdown content of the note.
 * @param {boolean} shouldCollapse - True to collapse target headers, false to expand.
 * @param {number[]} [targetLevels=ALL_HEADER_LEVELS] - Array of header levels (1-6) to target.
 * @returns {string} - Modified markdown content.
 */
export function processMarkdown(markdown, shouldCollapse, targetLevels = ALL_HEADER_LEVELS) {
  if (typeof markdown !== "string" || !markdown) {
    return markdown ?? "";
  }

  const isCRLF = markdown.includes("\r\n");
  const newline = isCRLF ? "\r\n" : "\n";
  const lines = markdown.split(/\r?\n/);

  let inCodeBlock = false;

  const modifiedLines = lines.map((line) => {
    // Toggle code block state upon encountering fences (``` or ~~~)
    if (CODE_BLOCK_FENCE_REGEX.test(line)) {
      inCodeBlock = !inCodeBlock;
      return line;
    }

    // Never modify lines inside code blocks (e.g. Python/Ruby/Bash # comments)
    if (inCodeBlock) {
      return line;
    }

    // Match headings H1 through H6
    const headerMatch = line.match(HEADER_PATTERN);
    if (!headerMatch) {
      return line;
    }

    const hashes = headerMatch[1];
    const level = hashes.length;

    // If this header level is not in the target list, leave it completely unchanged
    if (!targetLevels.includes(level)) {
      return line;
    }

    const contentAndComment = (headerMatch[2] || "").trim();
    const hasCollapse = COLLAPSE_TAG_REGEX.test(contentAndComment);

    if (shouldCollapse) {
      if (!hasCollapse) {
        return contentAndComment
          ? `${hashes} ${contentAndComment} ${COLLAPSE_COMMENT}`
          : `${hashes} ${COLLAPSE_COMMENT}`;
      }
      return line;
    } else {
      if (hasCollapse) {
        const cleanContent = contentAndComment
          .replace(new RegExp(COLLAPSE_TAG_REGEX, "gi"), "")
          .trim();
        return cleanContent ? `${hashes} ${cleanContent}` : hashes;
      }
      return line;
    }
  });

  return modifiedLines.join(newline);
}
