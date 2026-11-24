import { PROMPT_MESSAGE, PROMPT_CONFIG, ALERT_MESSAGE } from "./constants.js";

/**
 * Prompts user to select whether to expand or collapse headers.
 * Shows an alert if no selection is made.
 *
 * @param {object} app - Amplenote app instance.
 * @returns {Promise<number|null>} - Selected action value or null if dismissed/unselected.
 */
export async function promptCollapseAction(app) {
  if (!app?.prompt) {
    console.error("[HeaderCollapse] app.prompt is unavailable");
    return null;
  }

  try {
    const result = await app.prompt(PROMPT_MESSAGE, PROMPT_CONFIG);

    if (!result) {
      if (typeof app.alert === "function") {
        await app.alert(ALERT_MESSAGE);
      }
      return null;
    }

    return result;
  } catch (err) {
    console.error("[HeaderCollapse] Failed to prompt user:", err);
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
