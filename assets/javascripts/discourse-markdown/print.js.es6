/**
 * @file Adds [print] to bbcode
 * @example [print=line]content[/print]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["print"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("print", {
    tag: "print",
    replace: function (state, tagInfo, content) {
      let printOption = tagInfo.attrs["_default"];

      let token = state.push("div_open", "div", 1);
      if (!printOption) {
        token.attrs = [["class", "bbcode-print"]];
      } else {
        token.attrs = [["class", "bbcode-print-" + printOption]];
      }

      token = state.push("inline", "", 0);
      token.content = content;
      token.children = [];

      state.push("div_close", "div", -1);

      return true;
    },
  });
}

export function setup(helper) {
  helper.allowList([
    "div.bbcode-print-top-tear",
    "div.bbcode-print-bottom-tear",
    "div.bbcode-print",
    "div.bbcode-print-line",
    "div.bbcode-print-graph",
    "div.bbcode-print-parchment",
  ]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
