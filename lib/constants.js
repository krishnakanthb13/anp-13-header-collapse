export const ACTION_OPTIONS = {
  COLLAPSE_ALL: 1,
  EXPAND_ALL: 2,
  ADVANCED: 3
};

export const ADVANCED_ACTION = {
  COLLAPSE: 1,
  EXPAND: 2
};

export const ALL_HEADER_LEVELS = [1, 2, 3, 4, 5, 6];

export const INITIAL_PROMPT_MESSAGE = "Select if you want to Expand or Collapse Headers.";

export const INITIAL_PROMPT_CONFIG = {
  inputs: [
    {
      label: "Action",
      type: "radio",
      options: [
        { label: "Collapse All", value: ACTION_OPTIONS.COLLAPSE_ALL },
        { label: "Expand All", value: ACTION_OPTIONS.EXPAND_ALL },
        { label: "Advanced...", value: ACTION_OPTIONS.ADVANCED }
      ],
      value: ACTION_OPTIONS.COLLAPSE_ALL
    }
  ]
};

export const ADVANCED_PROMPT_MESSAGE = "Configure Advanced Header Collapse / Expand";

export const ADVANCED_PROMPT_CONFIG = {
  inputs: [
    {
      label: "Action",
      type: "radio",
      options: [
        { label: "Collapse", value: ADVANCED_ACTION.COLLAPSE },
        { label: "Expand", value: ADVANCED_ACTION.EXPAND }
      ],
      value: ADVANCED_ACTION.COLLAPSE
    },
    {
      label: "Include H1 (#)",
      type: "checkbox",
      value: true
    },
    {
      label: "Include H2 (##)",
      type: "checkbox",
      value: true
    },
    {
      label: "Include H3 (###)",
      type: "checkbox",
      value: true
    },
    {
      label: "Include H4–H6 (####+)",
      type: "checkbox",
      value: false
    }
  ]
};

export const ALERT_NO_SELECTION = "Please select an action!";
export const ALERT_NO_LEVELS = "Please select at least one header level to target!";

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
