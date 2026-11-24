/**
 * Primary action choices presented in the initial prompt.
 * @enum {number}
 */
export const ACTION_OPTIONS = {
  COLLAPSE_ALL: 1,
  EXPAND_ALL: 2,
  ADVANCED: 3
};

/**
 * Action choices in the advanced configuration dialog.
 * @enum {number}
 */
export const ADVANCED_ACTION = {
  COLLAPSE: 1,
  EXPAND: 2
};

/**
 * All valid Markdown header levels (H1 through H6).
 * @type {readonly number[]}
 */
export const ALL_HEADER_LEVELS = Object.freeze([1, 2, 3, 4, 5, 6]);

/**
 * Initial dialog message prompt.
 * @type {string}
 */
export const INITIAL_PROMPT_MESSAGE = "Select if you want to Expand or Collapse Headers.";

/**
 * Initial dialog options configuration.
 * @type {object}
 */
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

/**
 * Advanced dialog message prompt.
 * @type {string}
 */
export const ADVANCED_PROMPT_MESSAGE = "Configure Advanced Header Collapse / Expand";

/**
 * Advanced dialog configuration with selective header levels.
 * @type {object}
 */
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

/**
 * Alert message displayed when no header levels are selected in advanced mode.
 * @type {string}
 */
export const ALERT_NO_LEVELS = "Please select at least one header level to target!";

/**
 * Matches markdown headers H1 to H6 (1-6 hashes followed by whitespace and optional text or line end).
 * @type {RegExp}
 */
export const HEADER_PATTERN = /^(#{1,6})(?:\s+(.*?)|$)\s*$/;

/**
 * Tolerant regex for testing Amplenote header collapse comments (handles whitespace differences around braces/colons).
 * @type {RegExp}
 */
export const COLLAPSE_TAG_REGEX = /<!--\s*\{\s*"collapsed"\s*:\s*true\s*\}\s*-->/i;

/**
 * Precompiled global regex for stripping Amplenote header collapse comments without reallocation.
 * @type {RegExp}
 */
export const COLLAPSE_TAG_GLOBAL_REGEX = /<!--\s*\{\s*"collapsed"\s*:\s*true\s*\}\s*-->/gi;

/**
 * Regex detecting code block fences (``` or ~~~).
 * @type {RegExp}
 */
export const CODE_BLOCK_FENCE_REGEX = /^\s*(```|~~~)/;

/**
 * Standard collapse comment token inserted for collapsed headers.
 * @type {string}
 */
export const COLLAPSE_COMMENT = '<!-- {"collapsed":true} -->';
