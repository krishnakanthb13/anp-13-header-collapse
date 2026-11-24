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
var ALL_HEADER_LEVELS = [1, 2, 3, 4, 5, 6];
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
var HEADER_PATTERN = /^(#{1,6})(?:\s+(.*?)|$)\s*$/;
var COLLAPSE_TAG_REGEX = /<!--\s*\{\s*"collapsed"\s*:\s*true\s*\}\s*-->/i;
var CODE_BLOCK_FENCE_REGEX = /^\s*(```|~~~)/;
var COLLAPSE_COMMENT = '<!-- {"collapsed":true} -->';

// anp-13-header-collapse/lib/markdown.js
function processMarkdown(markdown, shouldCollapse, targetLevels = ALL_HEADER_LEVELS) {
  if (typeof markdown !== "string" || !markdown) {
    return markdown ?? "";
  }
  const isCRLF = markdown.includes("\r\n");
  const newline = isCRLF ? "\r\n" : "\n";
  const lines = markdown.split(/\r?\n/);
  let inCodeBlock = false;
  const modifiedLines = lines.map((line) => {
    if (CODE_BLOCK_FENCE_REGEX.test(line)) {
      inCodeBlock = !inCodeBlock;
      return line;
    }
    if (inCodeBlock) {
      return line;
    }
    const headerMatch = line.match(HEADER_PATTERN);
    if (!headerMatch) {
      return line;
    }
    const hashes = headerMatch[1];
    const level = hashes.length;
    if (!targetLevels.includes(level)) {
      return line;
    }
    const contentAndComment = (headerMatch[2] || "").trim();
    const hasCollapse = COLLAPSE_TAG_REGEX.test(contentAndComment);
    if (shouldCollapse) {
      if (!hasCollapse) {
        return contentAndComment ? `${hashes} ${contentAndComment} ${COLLAPSE_COMMENT}` : `${hashes} ${COLLAPSE_COMMENT}`;
      }
      return line;
    } else {
      if (hasCollapse) {
        const cleanContent = contentAndComment.replace(new RegExp(COLLAPSE_TAG_REGEX, "gi"), "").trim();
        return cleanContent ? `${hashes} ${cleanContent}` : hashes;
      }
      return line;
    }
  });
  return modifiedLines.join(newline);
}

// anp-13-header-collapse/lib/api.js
async function promptInitialAction(app) {
  if (!app?.prompt) {
    console.error("[HeaderCollapse] app.prompt is unavailable");
    return null;
  }
  try {
    const result = await app.prompt(INITIAL_PROMPT_MESSAGE, INITIAL_PROMPT_CONFIG);
    if (!result) {
      return null;
    }
    return result;
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
    const [actionVal, h1, h2, h3, h4h6] = result;
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
  try {
    await app.replaceNoteContent({ uuid: noteUUID }, content);
  } catch (err) {
    console.error("[HeaderCollapse] Failed to replace note content:", err);
    throw err;
  }
}

// anp-13-header-collapse/header-collapse.js
var header_collapse_default = {
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


return header_collapse_default;
})()