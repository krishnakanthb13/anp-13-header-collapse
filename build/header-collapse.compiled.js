(() => {
// anp-13-header-collapse/lib/constants.js
var ACTION_OPTIONS = {
  COLLAPSE_ALL: 1,
  EXPAND_ALL: 2,
  ADVANCED: 3
};
var ADVANCED_ACTION = {
  COLLAPSE: 1,
  EXPAND: 2
};
var ALL_HEADER_LEVELS = Object.freeze([1, 2, 3, 4, 5, 6]);
var INITIAL_PROMPT_MESSAGE = "Select if you want to Expand or Collapse Headers.";
var INITIAL_PROMPT_CONFIG = {
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
var ADVANCED_PROMPT_MESSAGE = "Configure Advanced Header Collapse / Expand";
var ADVANCED_PROMPT_CONFIG = {
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
      label: "Include H4\u2013H6 (####+)",
      type: "checkbox",
      value: false
    }
  ]
};
var ALERT_NO_LEVELS = "Please select at least one header level to target!";
var HEADER_PATTERN = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?[ \t]*$/;
var COLLAPSE_TAG_REGEX = /<!--\s*\{\s*"collapsed"\s*:\s*true\s*\}\s*-->/i;
var COLLAPSE_TAG_ANY_REGEX = /<!--\s*\{\s*"collapsed"\s*:\s*(?:true|false)\s*\}\s*-->/i;
var COLLAPSE_TAG_GLOBAL_REGEX = /[ \t]*<!--\s*\{\s*"collapsed"\s*:\s*(?:true|false)\s*\}\s*-->/gi;
var CODE_FENCE_PATTERN = /^( {0,3})(`{3,}|~{3,})(.*)$/;
var MAX_NOTE_LENGTH = 2e5;
var COLLAPSE_COMMENT = '<!-- {"collapsed":true} -->';

// anp-13-header-collapse/lib/markdown.js
function processMarkdown(markdown, shouldCollapse, targetLevels = ALL_HEADER_LEVELS) {
  if (typeof markdown !== "string" || !markdown) {
    return "";
  }
  const parts = markdown.split(/(\r\n|\n|\r)/);
  const targetSet = new Set(targetLevels);
  let fence = null;
  for (let i = 0; i < parts.length; i += 2) {
    const line = parts[i];
    const fenceMatch = line.match(CODE_FENCE_PATTERN);
    if (fenceMatch) {
      const marker = fenceMatch[2];
      const char = marker[0];
      const len = marker.length;
      const rest = fenceMatch[3];
      if (fence) {
        if (char === fence.char && len >= fence.len && rest.trim() === "") {
          fence = null;
        }
      } else {
        fence = { char, len };
      }
      continue;
    }
    if (fence) {
      continue;
    }
    const headerMatch = line.match(HEADER_PATTERN);
    if (!headerMatch) {
      continue;
    }
    const level = headerMatch[1].length;
    if (!targetSet.has(level)) {
      continue;
    }
    const hasCollapsedTrue = COLLAPSE_TAG_REGEX.test(line);
    const hasAnyAnnotation = COLLAPSE_TAG_ANY_REGEX.test(line);
    if (shouldCollapse) {
      if (hasCollapsedTrue) {
        continue;
      }
      const cleaned = line.replace(COLLAPSE_TAG_GLOBAL_REGEX, "").replace(/[ \t]+$/, "");
      parts[i] = `${cleaned} ${COLLAPSE_COMMENT}`;
    } else {
      if (!hasAnyAnnotation) {
        continue;
      }
      parts[i] = line.replace(COLLAPSE_TAG_GLOBAL_REGEX, "").replace(/[ \t]+$/, "");
    }
  }
  return parts.join("");
}

// anp-13-header-collapse/lib/api.js
var VALID_INITIAL_ACTIONS = new Set(Object.values(ACTION_OPTIONS));
var VALID_ADVANCED_ACTIONS = new Set(Object.values(ADVANCED_ACTION));
async function promptInitialAction(app) {
  if (!app?.prompt) {
    console.error("[HeaderCollapse] app.prompt is unavailable");
    return null;
  }
  try {
    const result = await app.prompt(INITIAL_PROMPT_MESSAGE, INITIAL_PROMPT_CONFIG);
    const action = Number(result);
    if (!result || !VALID_INITIAL_ACTIONS.has(action)) {
      return null;
    }
    return action;
  } catch (err) {
    console.error("[HeaderCollapse] Failed to prompt user:", err);
    return null;
  }
}
async function promptAdvancedOptions(app) {
  if (!app?.prompt) {
    console.error("[HeaderCollapse] app.prompt is unavailable");
    return null;
  }
  try {
    const result = await app.prompt(ADVANCED_PROMPT_MESSAGE, ADVANCED_PROMPT_CONFIG);
    if (!result || !Array.isArray(result)) {
      return null;
    }
    if (result.length < ADVANCED_PROMPT_CONFIG.inputs.length) {
      return null;
    }
    const [rawAction, h1, h2, h3, h4h6] = result;
    const actionVal = Number(rawAction);
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
async function fetchNoteContent(app, noteUUID) {
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
async function updateNoteContent(app, noteUUID, content) {
  if (!app?.replaceNoteContent || !noteUUID) {
    throw new Error("[HeaderCollapse] Invalid app instance or noteUUID for updateNoteContent");
  }
  if (typeof content === "string" && content.length > MAX_NOTE_LENGTH) {
    throw new Error(
      `[HeaderCollapse] Note exceeds Amplenote's ${MAX_NOTE_LENGTH}-character write limit`
    );
  }
  try {
    return await app.replaceNoteContent({ uuid: noteUUID }, content) !== false;
  } catch (err) {
    console.error("[HeaderCollapse] Failed to replace note content:", err);
    throw err;
  }
}

// anp-13-header-collapse/header-collapse.js
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
var header_collapse_default = {
  async noteOption(app, noteUUID) {
    if (!app || !noteUUID) {
      console.error("[HeaderCollapse] Missing required app or noteUUID parameter");
      return;
    }
    try {
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
      if (modifiedMarkdown !== markdown) {
        const updated = await updateNoteContent(app, noteUUID, modifiedMarkdown);
        if (updated === false) {
          const after = await fetchNoteContent(app, noteUUID);
          if (typeof after === "string" && after === markdown) {
            console.warn(
              "[HeaderCollapse] replaceNoteContent resolved false and the note content is unchanged; the note may be locked or read-only."
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


return header_collapse_default;
})()