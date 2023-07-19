/**
 * @file Adds [side] to bbcode
 * @example [side=right]content[/side]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption((siteSettings, opts) => (opts.features["side"] = !!siteSettings.rpn_bbcode_enabled));

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("side", {
    tag: "side",
    before: function (state, tagInfo) {
      let sideOption = tagInfo.attrs["_default"];
      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-side-" + sideOption]];
    },
    after: function (state) {
      state.push("div_close", "div", -1);
    },
  });
}

export function setup(helper) {
  helper.allowList(["div.bbcode-side-left", "div.bbcode-side-right"]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
