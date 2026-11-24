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

export default {
  async noteOption(app, noteUUID) {
    if (!app || !noteUUID) {
      console.error("[HeaderCollapse] Missing required app or noteUUID parameter");
      return;
    }

    try {
      const markdown = await fetchNoteContent(app, noteUUID);
      if (typeof markdown !== "string") {
        return;
      }

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

      const modifiedMarkdown = processMarkdown(markdown, shouldCollapse, targetLevels);

      // Performance: Skip write if markdown has not changed
      if (modifiedMarkdown !== markdown) {
        await updateNoteContent(app, noteUUID, modifiedMarkdown);
      }
    } catch (err) {
      console.error("[HeaderCollapse] An error occurred in noteOption:", err);
      if (typeof app?.alert === "function") {
        await app.alert(`An error occurred while updating headers: ${err?.message || err}`);
      }
    }
  }
};
