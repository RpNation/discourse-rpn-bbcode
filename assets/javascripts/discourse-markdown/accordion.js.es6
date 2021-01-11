/**
 * @file Adds [accordion] to bbcode
 * @example [accordion][slide=title]content[/slide][/accordion]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["accordion"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("accordion", {
    tag: "accordion",
    wrap: "div.bbcode-accordion",
  });

  BLOCK_RULER.push("slide", {
    tag: "slide",
    before: function (state, tagInfo) {
      let slideTitle = tagInfo.attrs["_default"];
      let token = state.push("button_open", "button", 1);
      token.attrs = [["class", "bbcode-slide-title"]];

      token = state.push("text", "", 0);
      token.content = slideTitle;

      state.push("button_close", "button", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-slide-content"]];
    },
    after: function (state) {
      state.push("div_close", "div", -1);
    },
  });
}

export function setup(helper) {
  helper.allowList([
    "div.bbcode-accordion",
    "button.bbcode-slide-title",
    "div.bbcode-slide-content",
  ]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
