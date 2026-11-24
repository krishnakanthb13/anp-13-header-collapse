/**
 * @file header-collapse.js
 * @description Amplenote Plugin: Header Collapse (anp-13-header-collapse)
 * Automatically expands or collapses all headers throughout a note.
 */

import { ACTION_OPTIONS } from "./lib/constants.js";
import { processMarkdown } from "./lib/markdown.js";
import { promptCollapseAction, fetchNoteContent, updateNoteContent } from "./lib/api.js";

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

      const result = await promptCollapseAction(app);
      if (!result) {
        return;
      }

      const shouldCollapse = result === ACTION_OPTIONS.COLLAPSE;
      const modifiedMarkdown = processMarkdown(markdown, shouldCollapse);

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
