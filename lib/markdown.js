import {
  HEADER_PATTERN,
  COLLAPSE_TAG_REGEX,
  COLLAPSE_TAG_ANY_REGEX,
  COLLAPSE_TAG_GLOBAL_REGEX,
  CODE_FENCE_PATTERN,
  COLLAPSE_COMMENT,
  ALL_HEADER_LEVELS
} from "./constants.js";

/**
 * Process markdown content and add or remove header collapse comments.
 * Correctly ignores nested / longer-fenced code blocks, handles emojis and rich formatting,
 * tolerates JSON tag whitespace, preserves the original line endings, and selectively
 * targets specified header levels.
 *
 * @param {string} markdown - Raw markdown content of the note.
 * @param {boolean} shouldCollapse - True to collapse target headers, false to expand.
 * @param {readonly number[]|number[]} [targetLevels=ALL_HEADER_LEVELS] - Array of header levels (1-6) to target.
 * @returns {string} - Modified markdown content (empty string for non-string/empty input).
 */
export function processMarkdown(markdown, shouldCollapse, targetLevels = ALL_HEADER_LEVELS) {
  if (typeof markdown !== "string" || !markdown) {
    return "";
  }

  // Split while keeping each line's terminator, so mixed/CRLF/LF endings survive untouched.
  // Even indices are line content; odd indices are the separators between them.
  const parts = markdown.split(/(\r\n|\n|\r)/);

  // Convert targetLevels to a Set once for O(1) level lookups across all lines
  const targetSet = new Set(targetLevels);

  // Tracks the currently open fence: { char, len } or null. Remembering the marker
  // character and length is what prevents a ```` block from being closed early by an
  // inner ``` line (and vice versa).
  let fence = null;

  for (let i = 0; i < parts.length; i += 2) {
    const line = parts[i];

    const fenceMatch = line.match(CODE_FENCE_PATTERN);
    if (fenceMatch) {
      const marker = fenceMatch[2];
      const char = marker[0];
      const len = marker.length;
      const rest = fenceMatch[3];

      if (fence) {
        // A closing fence must use the same character, be at least as long as the
        // opening fence, and carry no info string.
        if (char === fence.char && len >= fence.len && rest.trim() === "") {
          fence = null;
        }
      } else {
        fence = { char, len };
      }
      continue;
    }

    // Never modify lines inside code blocks (e.g. Python/Ruby/Bash # comments)
    if (fence) {
      continue;
    }

    // Match ATX headings H1 through H6 (allowing up to three leading spaces)
    const headerMatch = line.match(HEADER_PATTERN);
    if (!headerMatch) {
      continue;
    }

    const level = headerMatch[1].length;

    // If this header level is not in the target list, leave it completely unchanged
    if (!targetSet.has(level)) {
      continue;
    }

    const hasCollapsedTrue = COLLAPSE_TAG_REGEX.test(line);
    const hasAnyAnnotation = COLLAPSE_TAG_ANY_REGEX.test(line);

    if (shouldCollapse) {
      // Already collapsed: leave the line byte-for-byte untouched (idempotent).
      if (hasCollapsedTrue) {
        continue;
      }
      // Strip any stale `false`/`true` annotation, then append the canonical one.
      // Operating on the original line preserves its internal whitespace and indentation.
      const cleaned = line.replace(COLLAPSE_TAG_GLOBAL_REGEX, "").replace(/[ \t]+$/, "");
      parts[i] = `${cleaned} ${COLLAPSE_COMMENT}`;
    } else {
      if (!hasAnyAnnotation) {
        continue;
      }
      // Remove the annotation (and the whitespace that preceded it), preserving the rest.
      parts[i] = line.replace(COLLAPSE_TAG_GLOBAL_REGEX, "").replace(/[ \t]+$/, "");
    }
  }

  return parts.join("");
}
