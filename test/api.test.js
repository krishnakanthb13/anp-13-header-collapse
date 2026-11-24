import { jest } from "@jest/globals";
import {
  promptInitialAction,
  promptAdvancedOptions,
  fetchNoteContent,
  updateNoteContent
} from "../lib/api.js";
import { ACTION_OPTIONS, ADVANCED_ACTION, ALERT_NO_LEVELS } from "../lib/constants.js";

describe("api.js — Amplenote API Client", () => {
  let mockApp;

  beforeEach(() => {
    mockApp = {
      prompt: jest.fn(),
      alert: jest.fn(),
      getNoteContent: jest.fn(),
      replaceNoteContent: jest.fn()
    };
  });

  describe("promptInitialAction", () => {
    describe("Happy Path", () => {
      test("returns COLLAPSE_ALL (1) when selected", async () => {
        mockApp.prompt.mockResolvedValue(ACTION_OPTIONS.COLLAPSE_ALL);
        const result = await promptInitialAction(mockApp);
        expect(result).toBe(ACTION_OPTIONS.COLLAPSE_ALL);
      });

      test("returns EXPAND_ALL (2) when selected", async () => {
        mockApp.prompt.mockResolvedValue(ACTION_OPTIONS.EXPAND_ALL);
        const result = await promptInitialAction(mockApp);
        expect(result).toBe(ACTION_OPTIONS.EXPAND_ALL);
      });

      test("returns ADVANCED (3) when selected", async () => {
        mockApp.prompt.mockResolvedValue(ACTION_OPTIONS.ADVANCED);
        const result = await promptInitialAction(mockApp);
        expect(result).toBe(ACTION_OPTIONS.ADVANCED);
      });
    });

    describe("Edge Cases", () => {
      test("returns null when user cancels dialog", async () => {
        mockApp.prompt.mockResolvedValue(null);
        const result = await promptInitialAction(mockApp);
        expect(result).toBeNull();
      });

      test("returns null when prompt returns an unrecognized action", async () => {
        mockApp.prompt.mockResolvedValue(999);
        const result = await promptInitialAction(mockApp);
        expect(result).toBeNull();
      });
    });

    describe("Error Handling", () => {
      test("returns null safely if app is null", async () => {
        const result = await promptInitialAction(null);
        expect(result).toBeNull();
      });

      test("returns null safely if app.prompt is not a function", async () => {
        const result = await promptInitialAction({});
        expect(result).toBeNull();
      });

      test("returns null and catches when app.prompt rejects", async () => {
        mockApp.prompt.mockRejectedValue(new Error("Prompt failed"));
        const result = await promptInitialAction(mockApp);
        expect(result).toBeNull();
      });
    });
  });

  describe("promptAdvancedOptions", () => {
    describe("Happy Path", () => {
      test("returns shouldCollapse: true and selected levels [1, 2]", async () => {
        // [action, h1, h2, h3, h4h6]
        mockApp.prompt.mockResolvedValue([ADVANCED_ACTION.COLLAPSE, true, true, false, false]);
        const result = await promptAdvancedOptions(mockApp);
        expect(result).toEqual({
          shouldCollapse: true,
          targetLevels: [1, 2]
        });
      });

      test("returns shouldCollapse: false and levels [1, 2, 3, 4, 5, 6]", async () => {
        mockApp.prompt.mockResolvedValue([ADVANCED_ACTION.EXPAND, true, true, true, true]);
        const result = await promptAdvancedOptions(mockApp);
        expect(result).toEqual({
          shouldCollapse: false,
          targetLevels: [1, 2, 3, 4, 5, 6]
        });
      });
    });

    describe("Edge Cases", () => {
      test("returns null when user cancels dialog", async () => {
        mockApp.prompt.mockResolvedValue(null);
        const result = await promptAdvancedOptions(mockApp);
        expect(result).toBeNull();
      });

      test("alerts and returns null if no header levels are checked", async () => {
        mockApp.prompt.mockResolvedValue([ADVANCED_ACTION.COLLAPSE, false, false, false, false]);
        const result = await promptAdvancedOptions(mockApp);
        expect(result).toBeNull();
        expect(mockApp.alert).toHaveBeenCalledWith(ALERT_NO_LEVELS);
      });

      test("returns null if returned action value is invalid", async () => {
        mockApp.prompt.mockResolvedValue([999, true, false, false, false]);
        const result = await promptAdvancedOptions(mockApp);
        expect(result).toBeNull();
      });

      test("returns null for a short/partial result array", async () => {
        mockApp.prompt.mockResolvedValue([ADVANCED_ACTION.COLLAPSE, true, false]);
        const result = await promptAdvancedOptions(mockApp);
        expect(result).toBeNull();
      });

      test("coerces a numeric-string action value", async () => {
        mockApp.prompt.mockResolvedValue(["1", true, true, false, false]);
        const result = await promptAdvancedOptions(mockApp);
        expect(result).toEqual({ shouldCollapse: true, targetLevels: [1, 2] });
      });
    });

    describe("Error Handling", () => {
      test("returns null safely if app is null", async () => {
        const result = await promptAdvancedOptions(null);
        expect(result).toBeNull();
      });

      test("returns null and catches when app.prompt rejects", async () => {
        mockApp.prompt.mockRejectedValue(new Error("Dialog crashed"));
        const result = await promptAdvancedOptions(mockApp);
        expect(result).toBeNull();
      });
    });
  });

  describe("fetchNoteContent", () => {
    describe("Happy Path", () => {
      test("fetches note markdown content successfully", async () => {
        mockApp.getNoteContent.mockResolvedValue("# My Note Content");
        const content = await fetchNoteContent(mockApp, "note-uuid-123");
        expect(content).toBe("# My Note Content");
        expect(mockApp.getNoteContent).toHaveBeenCalledWith({ uuid: "note-uuid-123" });
      });
    });

    describe("Error Handling", () => {
      test("throws when app is missing or invalid", async () => {
        await expect(fetchNoteContent(null, "note-uuid-123")).rejects.toThrow("Invalid app instance or noteUUID");
      });

      test("throws when noteUUID is missing", async () => {
        await expect(fetchNoteContent(mockApp, "")).rejects.toThrow("Invalid app instance or noteUUID");
      });

      test("rethrows when app.getNoteContent rejects", async () => {
        mockApp.getNoteContent.mockRejectedValue(new Error("Note not found"));
        await expect(fetchNoteContent(mockApp, "note-uuid-123")).rejects.toThrow("Note not found");
      });
    });
  });

  describe("updateNoteContent", () => {
    describe("Happy Path", () => {
      test("replaces note content successfully and reports success", async () => {
        mockApp.replaceNoteContent.mockResolvedValue(undefined);
        const result = await updateNoteContent(mockApp, "note-uuid-123", "# Updated Markdown");
        expect(result).toBe(true);
        expect(mockApp.replaceNoteContent).toHaveBeenCalledWith({ uuid: "note-uuid-123" }, "# Updated Markdown");
      });

      test("returns false when the host reports the write was not performed", async () => {
        mockApp.replaceNoteContent.mockResolvedValue(false);
        const result = await updateNoteContent(mockApp, "note-uuid-123", "# Updated Markdown");
        expect(result).toBe(false);
      });
    });

    describe("Error Handling", () => {
      test("throws when app is missing or invalid", async () => {
        await expect(updateNoteContent(null, "note-uuid-123", "content")).rejects.toThrow("Invalid app instance or noteUUID");
      });

      test("throws when noteUUID is missing", async () => {
        await expect(updateNoteContent(mockApp, "", "content")).rejects.toThrow("Invalid app instance or noteUUID");
      });

      test("rethrows when app.replaceNoteContent rejects", async () => {
        mockApp.replaceNoteContent.mockRejectedValue(new Error("Write permission denied"));
        await expect(updateNoteContent(mockApp, "note-uuid-123", "content")).rejects.toThrow("Write permission denied");
      });

      test("throws before writing when content exceeds the 200,000-character limit", async () => {
        const tooLong = "x".repeat(200001);
        await expect(updateNoteContent(mockApp, "note-uuid-123", tooLong)).rejects.toThrow(
          "200000-character write limit"
        );
        expect(mockApp.replaceNoteContent).not.toHaveBeenCalled();
      });
    });
  });
});
