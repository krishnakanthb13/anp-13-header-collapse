import { jest } from "@jest/globals";
import plugin from "../header-collapse.js";
import { ACTION_OPTIONS, ADVANCED_ACTION, COLLAPSE_COMMENT } from "../lib/constants.js";

describe("header-collapse.js — Plugin Orchestrator", () => {
  let mockApp;
  const testUUID = "test-note-uuid";

  beforeEach(() => {
    mockApp = {
      prompt: jest.fn(),
      alert: jest.fn(),
      getNoteContent: jest.fn(),
      replaceNoteContent: jest.fn()
    };
  });

  describe("Happy Path", () => {
    test("collapses all headers when user chooses Collapse All", async () => {
      mockApp.getNoteContent.mockResolvedValue("# Header 1\n## Header 2");
      mockApp.prompt.mockResolvedValue(ACTION_OPTIONS.COLLAPSE_ALL);

      await plugin.noteOption(mockApp, testUUID);

      expect(mockApp.replaceNoteContent).toHaveBeenCalledWith(
        { uuid: testUUID },
        `# Header 1 ${COLLAPSE_COMMENT}\n## Header 2 ${COLLAPSE_COMMENT}`
      );
    });

    test("expands all headers when user chooses Expand All", async () => {
      mockApp.getNoteContent.mockResolvedValue(`# Header 1 ${COLLAPSE_COMMENT}\n## Header 2 ${COLLAPSE_COMMENT}`);
      mockApp.prompt.mockResolvedValue(ACTION_OPTIONS.EXPAND_ALL);

      await plugin.noteOption(mockApp, testUUID);

      expect(mockApp.replaceNoteContent).toHaveBeenCalledWith(
        { uuid: testUUID },
        "# Header 1\n## Header 2"
      );
    });

    test("collapses selective levels when user chooses Advanced", async () => {
      mockApp.getNoteContent.mockResolvedValue("# Header 1\n## Header 2\n### Header 3");
      // Stage 1: Choose Advanced
      mockApp.prompt.mockResolvedValueOnce(ACTION_OPTIONS.ADVANCED);
      // Stage 2: Collapse only H1 ([action, h1, h2, h3, h4h6])
      mockApp.prompt.mockResolvedValueOnce([ADVANCED_ACTION.COLLAPSE, true, false, false, false]);

      await plugin.noteOption(mockApp, testUUID);

      expect(mockApp.replaceNoteContent).toHaveBeenCalledWith(
        { uuid: testUUID },
        `# Header 1 ${COLLAPSE_COMMENT}\n## Header 2\n### Header 3`
      );
    });
  });

  describe("Edge Cases & Optimizations", () => {
    test("skips replaceNoteContent if content is unchanged (performance optimization)", async () => {
      // Content is already fully collapsed
      mockApp.getNoteContent.mockResolvedValue(`# Header 1 ${COLLAPSE_COMMENT}`);
      mockApp.prompt.mockResolvedValue(ACTION_OPTIONS.COLLAPSE_ALL);

      await plugin.noteOption(mockApp, testUUID);

      expect(mockApp.replaceNoteContent).not.toHaveBeenCalled();
    });

    test("exits safely without error when app is missing", async () => {
      await expect(plugin.noteOption(null, testUUID)).resolves.not.toThrow();
    });

    test("exits safely without error when noteUUID is missing", async () => {
      await expect(plugin.noteOption(mockApp, "")).resolves.not.toThrow();
    });

    test("exits safely when user cancels Stage 1 prompt", async () => {
      mockApp.getNoteContent.mockResolvedValue("# Header 1");
      mockApp.prompt.mockResolvedValue(null);

      await plugin.noteOption(mockApp, testUUID);

      expect(mockApp.replaceNoteContent).not.toHaveBeenCalled();
    });

    test("exits safely when user cancels Stage 2 advanced prompt", async () => {
      mockApp.getNoteContent.mockResolvedValue("# Header 1");
      mockApp.prompt.mockResolvedValueOnce(ACTION_OPTIONS.ADVANCED);
      mockApp.prompt.mockResolvedValueOnce(null);

      await plugin.noteOption(mockApp, testUUID);

      expect(mockApp.replaceNoteContent).not.toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    test("catches error during execution and alerts the user", async () => {
      mockApp.getNoteContent.mockRejectedValue(new Error("Network timeout"));

      await plugin.noteOption(mockApp, testUUID);

      expect(mockApp.alert).toHaveBeenCalledWith(
        expect.stringContaining("An error occurred while updating headers: Network timeout")
      );
    });
  });
});
