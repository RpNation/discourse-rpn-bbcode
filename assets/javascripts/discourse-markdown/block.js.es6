/**
 * @file Adds [block] to bbcode
 * @example [block=dice]content[/block]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["block"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("block", {
    tag: "block",
    before: function (state, tagInfo) {
      const OPTIONS = [
        "block",
        "dice",
        "dice10",
        "setting",
        "warning",
        "storyteller",
        "announcement",
        "important",
        "question",
        "encounter",
        "information",
        "character",
        "treasure",
      ];
      let blockOption = tagInfo.attrs["_default"];
      if (!OPTIONS.includes(blockOption)) {
        blockOption = "block";
      }
      blockOption = blockOption.toLowerCase();
      let token = state.push("div_open", "div", 1);
      token.attrs = [
        ["class", "bbcode-block"],
        ["data-bbcode-block", blockOption],
      ];
      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-block-icon"]];
      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-block-content"]];
    },
    after: function (state) {
      state.push("div_close", "div", -1);
      state.push("div_close", "div", -1);
    },
  });
}

export function setup(helper) {
  helper.allowList([
    "div.bbcode-block",
    "div[data-bbcode-block=*]",
    "div.bbcode-block-icon",
    "div.bbcode-block-content",
  ]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
