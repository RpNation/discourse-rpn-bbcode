/**
 * @file Adds [tabs] to bbcode
 * @example [tabs][tab=title]content[/tab][/tabs]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption((siteSettings, opts) => (opts.features["tabs"] = !!siteSettings.rpn_bbcode_enabled));

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("tabs", {
    tag: "tabs",
    wrap: "div.bbcode-tab",
  });

  BLOCK_RULER.push("tab", {
    tag: "tab",
    before: function (state, tagInfo) {
      let tabTitle = tagInfo.attrs["_default"];

      let token = state.push("button_open", "button", 1);
      token.attrs = [["class", "bbcode-tab-links"]];

      token = state.push("text", "", 0);
      token.content = tabTitle;

      state.push("button_close", "button", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-tab-content"]];
    },
    after: function (state) {
      state.push("div_close", "div", -1);
    },
  });
}

export function setup(helper) {
  helper.allowList(["div.bbcode-tab", "button.bbcode-tab-links", "div.bbcode-tab-content"]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
