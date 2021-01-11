/**
 * @file Adds [spoiler] to bbcode
 * @example [spoiler=title]content[/spoiler]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["spoiler"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("spoiler", {
    tag: "spoiler",
    before: function (state, tagInfo) {
      let title = tagInfo.attrs["_default"];
      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-spoiler"]];

      token = state.push("button_open", "button", 1);
      token.attrs = [["class", "bbcode-spoiler-button"]];
      token = state.push("text", "", 0);
      if (!title) {
        token.content = "Spoiler";
      } else {
        token.content = "Spoiler: " + title.trim();
      }
      state.push("button_close", "button", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-spoiler-content"]];
    },
    after: function (state) {
      state.push("div_close", "div", -1);
      state.push("div_close", "div", -1);
      return true;
    },
  });
}

export function setup(helper) {
  helper.allowList([
    "div.bbcode-spoiler",
    "button.bbcode-spoiler-button",
    "div.bbcode-spoiler-content",
  ]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
