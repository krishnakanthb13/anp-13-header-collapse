import {
  INITIAL_PROMPT_MESSAGE,
  INITIAL_PROMPT_CONFIG,
  ADVANCED_PROMPT_MESSAGE,
  ADVANCED_PROMPT_CONFIG,
  ALERT_NO_LEVELS,
  ACTION_OPTIONS,
  ADVANCED_ACTION
} from "./constants.js";

const VALID_INITIAL_ACTIONS = new Set(Object.values(ACTION_OPTIONS));
const VALID_ADVANCED_ACTIONS = new Set(Object.values(ADVANCED_ACTION));

/**
 * Prompts user to select initial action (Collapse All, Expand All, or Advanced).
 *
 * @param {object} app - Amplenote app instance.
 * @returns {Promise<number|null>} - Selected action value or null if dismissed/invalid.
 */
export async function promptInitialAction(app) {
  if (!app?.prompt) {
    console.error("[HeaderCollapse] app.prompt is unavailable");
    return null;
  }

  try {
    const result = await app.prompt(INITIAL_PROMPT_MESSAGE, INITIAL_PROMPT_CONFIG);

    if (!result || !VALID_INITIAL_ACTIONS.has(result)) {
      return null;
    }

    return result;
  } catch (err) {
    console.error("[HeaderCollapse] Failed to prompt user:", err);
    return null;
  }
}

/**
 * Prompts user for advanced options (action + target header levels).
 *
 * @param {object} app - Amplenote app instance.
 * @returns {Promise<{ shouldCollapse: boolean, targetLevels: number[] }|null>}
 */
export async function promptAdvancedOptions(app) {
  if (!app?.prompt) {
    console.error("[HeaderCollapse] app.prompt is unavailable");
    return null;
  }

  try {
    const result = await app.prompt(ADVANCED_PROMPT_MESSAGE, ADVANCED_PROMPT_CONFIG);

    if (!result || !Array.isArray(result)) {
      return null;
    }

    const [actionVal, h1, h2, h3, h4h6] = result;

    if (!VALID_ADVANCED_ACTIONS.has(actionVal)) {
      return null;
    }

    const targetLevels = [];
    if (h1) targetLevels.push(1);
    if (h2) targetLevels.push(2);
    if (h3) targetLevels.push(3);
    if (h4h6) targetLevels.push(4, 5, 6);

    if (targetLevels.length === 0) {
      if (typeof app.alert === "function") {
        await app.alert(ALERT_NO_LEVELS);
      }
      return null;
    }

    return {
      shouldCollapse: actionVal === ADVANCED_ACTION.COLLAPSE,
      targetLevels
    };
  } catch (err) {
    console.error("[HeaderCollapse] Failed to prompt advanced options:", err);
    return null;
  }
}

/**
 * Fetches the markdown content of a note by UUID.
 *
 * @param {object} app - Amplenote app instance.
 * @param {string} noteUUID - UUID of the target note.
 * @returns {Promise<string>}
 */
export async function fetchNoteContent(app, noteUUID) {
  if (!app?.getNoteContent || !noteUUID) {
    throw new Error("[HeaderCollapse] Invalid app instance or noteUUID for fetchNoteContent");
  }

  try {
    return await app.getNoteContent({ uuid: noteUUID });
  } catch (err) {
    console.error("[HeaderCollapse] Failed to fetch note content:", err);
    throw err;
  }
}

/**
 * Replaces the markdown content of a note by UUID.
 *
 * @param {object} app - Amplenote app instance.
 * @param {string} noteUUID - UUID of the target note.
 * @param {string} content - Updated markdown content.
 * @returns {Promise<void>}
 */
export async function updateNoteContent(app, noteUUID, content) {
  if (!app?.replaceNoteContent || !noteUUID) {
    throw new Error("[HeaderCollapse] Invalid app instance or noteUUID for updateNoteContent");
  }

  try {
    await app.replaceNoteContent({ uuid: noteUUID }, content);
  } catch (err) {
    console.error("[HeaderCollapse] Failed to replace note content:", err);
    throw err;
  }
}
