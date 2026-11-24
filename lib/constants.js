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
 * Matches ATX markdown headers H1 to H6, allowing up to three leading spaces (per GFM).
 * Capture group 1 is the hash sequence; group 2 is the optional heading text.
 * @type {RegExp}
 */
export const HEADER_PATTERN = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?[ \t]*$/;

/**
 * Matches a header already in the collapsed state (tolerant of whitespace around braces/colons).
 * Used to keep collapse idempotent without rewriting existing annotations.
 * @type {RegExp}
 */
export const COLLAPSE_TAG_REGEX = /<!--\s*\{\s*"collapsed"\s*:\s*true\s*\}\s*-->/i;

/**
 * Matches any collapse annotation, whether `true` or `false`.
 * @type {RegExp}
 */
export const COLLAPSE_TAG_ANY_REGEX = /<!--\s*\{\s*"collapsed"\s*:\s*(?:true|false)\s*\}\s*-->/i;

/**
 * Global regex for stripping any collapse annotation (true or false) plus any whitespace
 * immediately preceding it, so expanding never leaves double spaces or conflicting tags.
 * @type {RegExp}
 */
export const COLLAPSE_TAG_GLOBAL_REGEX = /[ \t]*<!--\s*\{\s*"collapsed"\s*:\s*(?:true|false)\s*\}\s*-->/gi;

/**
 * Matches a fenced code block delimiter (``` or ~~~) with up to three leading spaces.
 * Capture group 1 is the indentation, group 2 the marker run, group 3 the remainder
 * (info string when opening, empty/whitespace when closing).
 * @type {RegExp}
 */
export const CODE_FENCE_PATTERN = /^( {0,3})(`{3,}|~{3,})(.*)$/;

/**
 * Amplenote's documented maximum length for markdown passed to a single API call.
 * @type {number}
 */
export const MAX_NOTE_LENGTH = 200000;

/**
 * Standard collapse comment token inserted for collapsed headers.
 * @type {string}
 */
export const COLLAPSE_COMMENT = '<!-- {"collapsed":true} -->';
