/**
 * @file Adds [progress] to bbcode
 * @example [progress=50]text[/progress]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["progress"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  // const BLOCK_RULER = md.block.bbcode.ruler;
  const INLINE_RULER = md.inline.bbcode.ruler;

  INLINE_RULER.push("progress", {
    tag: "progress",
    replace: function (state, tagInfo, content) {
      let progressOption = tagInfo.attrs["_default"] || "100";

      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-progress"]];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-progress-text"]];

      token = state.push("text", "", 0);
      token.content = content || "";
      token.children = [];

      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [
        ["class", "bbcode-progress-bar"],
        ["style", "width: calc(" + progressOption + "% - 6px);"],
      ];

      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-progress-bar-other"]];

      state.push("div_close", "div", -1);

      state.push("div_close", "div", -1);

      return true;
    },
  });
}

export function setup(helper) {
  helper.allowList([
    "div.bbcode-progress",
    "div.bbcode-progress-text",
    "div.bbcode-progress-bar",
    "div.bbcode-progress-bar-other",
  ]);
  helper.allowList({
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        return /^(width: calc\(([0-9]|[1-9][0-9]|(100))% - 6px\);)$/.exec(value);
      }
    },
  });
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
