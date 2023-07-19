/**
 * @file Adds [thinprogress] to bbcode
 * @example [thinprogress=10]test[/thinprogress]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["thin-progress"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const INLINE_RULER = md.inline.bbcode.ruler;
  // const BLOCK_RULER = md.block.bbcode.ruler;

  INLINE_RULER.push("thinprogress", {
    tag: "thinprogress",
    replace: function (state, tagInfo, content) {
      let progressOption = tagInfo.attrs["_default"] || "100%";

      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-progress-thin"]];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-progress-text"]];

      token = state.push("text", "", 0);
      token.content = (content || "").replace(/[\r\n]+/g, " ");
      token.children = [];

      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [
        ["class", "bbcode-progress-bar"],
        ["style", "width: " + progressOption + "%;"],
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
    "div.bbcode-progress-thin",
    "div.bbcode-progress-text",
    "div.bbcode-progress-bar",
    "div.bbcode-progress-bar-other",
  ]);
  helper.allowList({
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        return /^(width: ([0-9]|[1-9][0-9]|(100))%;)$/.exec(value);
      }
    },
  });
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
