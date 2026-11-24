(() => {
// anp-13-header-collapse/lib/constants.js
var ACTION_OPTIONS = {
  COLLAPSE: 1,
  EXPAND: 2
};
var PROMPT_MESSAGE = "Select if you want to Expand or Collapse all Headers.";
var PROMPT_CONFIG = {
  inputs: [
    {
      label: "Select action",
      type: "radio",
      options: [
        { label: "Collapse", value: ACTION_OPTIONS.COLLAPSE },
        { label: "Expand", value: ACTION_OPTIONS.EXPAND }
      ]
    }
  ]
};
var ALERT_MESSAGE = "Please select either Collapse or Expand!";
var HEADER_PATTERN = /^(#{1,6})(?:\s+(.*?)|$)\s*$/;
var COLLAPSE_TAG_REGEX = /<!--\s*\{\s*"collapsed"\s*:\s*true\s*\}\s*-->/i;
var CODE_BLOCK_FENCE_REGEX = /^\s*(```|~~~)/;
var COLLAPSE_COMMENT = '<!-- {"collapsed":true} -->';

// anp-13-header-collapse/lib/markdown.js
function processMarkdown(markdown, shouldCollapse) {
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
async function promptCollapseAction(app) {
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
      const result = await promptCollapseAction(app);
      if (!result) {
        return;
      }
      const shouldCollapse = result === ACTION_OPTIONS.COLLAPSE;
      const modifiedMarkdown = processMarkdown(markdown, shouldCollapse);
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