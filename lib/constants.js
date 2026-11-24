export const ACTION_OPTIONS = {
  COLLAPSE: 1,
  EXPAND: 2
};

export const PROMPT_MESSAGE = "Select if you want to Expand or Collapse all Headers.";

export const PROMPT_CONFIG = {
  inputs: [
    {
      label: "Select action",
      type: "radio",
      options: [
        { label: "Collapse", value: ACTION_OPTIONS.COLLAPSE },
        { label: "Expand", value: ACTION_OPTIONS.EXPAND }
      ]
    }
  ]
};

export const ALERT_MESSAGE = "Please select either Collapse or Expand!";

/**
 * Matches markdown headers H1 to H6 (1-6 hashes followed by whitespace and optional text or line end).
 */
export const HEADER_PATTERN = /^(#{1,6})(?:\s+(.*?)|$)\s*$/;

/**
 * Tolerant regex for Amplenote header collapse comments (handles whitespace differences around braces/colons).
 */
export const COLLAPSE_TAG_REGEX = /<!--\s*\{\s*"collapsed"\s*:\s*true\s*\}\s*-->/i;

/**
 * Regex detecting code block fences (``` or ~~~).
 */
export const CODE_BLOCK_FENCE_REGEX = /^\s*(```|~~~)/;

/**
 * Standard collapse comment token inserted for collapsed headers.
 */
export const COLLAPSE_COMMENT = '<!-- {"collapsed":true} -->';
