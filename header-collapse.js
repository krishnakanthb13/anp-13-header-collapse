/**
 * @file header-collapse.js
 * @description Amplenote Plugin: Header Collapse (anp-13-header-collapse)
 * Automatically expands or collapses headers (all or selective levels) throughout a note.
 */

import { ACTION_OPTIONS, ALL_HEADER_LEVELS } from "./lib/constants.js";
import { processMarkdown } from "./lib/markdown.js";
import {
  promptInitialAction,
  promptAdvancedOptions,
  fetchNoteContent,
  updateNoteContent
} from "./lib/api.js";

async function safeAlert(app, message) {
  if (typeof app?.alert !== "function") {
    return;
  }
  try {
    await app.alert(message);
  } catch (err) {
    console.error("[HeaderCollapse] Failed to show alert:", err);
  }
}

export default {
  async noteOption(app, noteUUID) {
    if (!app || !noteUUID) {
      console.error("[HeaderCollapse] Missing required app or noteUUID parameter");
      return;
    }

    try {
      // Prompt first, then read: this keeps the note snapshot fresh by minimizing the
      // window between reading and writing (the write replaces the entire note).
      const action = await promptInitialAction(app);
      if (!action) {
        return;
      }

      let shouldCollapse;
      let targetLevels = ALL_HEADER_LEVELS;

      if (action === ACTION_OPTIONS.ADVANCED) {
        const advanced = await promptAdvancedOptions(app);
        if (!advanced) {
          return;
        }
        shouldCollapse = advanced.shouldCollapse;
        targetLevels = advanced.targetLevels;
      } else {
        shouldCollapse = action === ACTION_OPTIONS.COLLAPSE_ALL;
      }

      const markdown = await fetchNoteContent(app, noteUUID);
      if (typeof markdown !== "string") {
        await safeAlert(app, "Could not read the note content.");
        return;
      }

      const modifiedMarkdown = processMarkdown(markdown, shouldCollapse, targetLevels);

      // Performance: Skip write if markdown has not changed
      if (modifiedMarkdown !== markdown) {
        const updated = await updateNoteContent(app, noteUUID, modifiedMarkdown);

        // Some Amplenote versions resolve `false` even when the write succeeds
        // (and the local content is updated), so the boolean is not trustworthy.
        // Verify by reading back and only log if the content genuinely did not change.
        // We intentionally do not raise a user-facing error here.
        if (updated === false) {
          const after = await fetchNoteContent(app, noteUUID);
          if (typeof after === "string" && after === markdown) {
            console.warn(
              "[HeaderCollapse] replaceNoteContent resolved false and the note content is unchanged; " +
                "the note may be locked or read-only."
            );
          }
        }
      }
    } catch (err) {
      console.error("[HeaderCollapse] An error occurred in noteOption:", err);
      await safeAlert(app, `An error occurred while updating headers: ${err?.message || err}`);
    }
  }
};
