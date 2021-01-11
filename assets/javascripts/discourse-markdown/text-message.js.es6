/**
 * @file Adds [textmessage] to bbcode
 * @example [textmessage][message=me]hi[/message][message=them]hello[/message][/textmessage]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["text-message"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("textmessage", {
    tag: "textmessage",
    replace: function (state, tagInfo, content) {
      let textOption = tagInfo.attrs["_default"];

      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-textmessage"]];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-textmessage-name"]];

      token = state.push("text", "", 0);
      token.content = textOption;

      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-textmessage-overflow"]];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-textmessage-content"]];

      token = state.push("text", "", 0);
      token.content = content;

      state.push("div_close", "div", -1);

      state.push("div_close", "div", -1);

      state.push("div_close", "div", -1);

      return true;
    },
  });
}

export function setup(helper) {
  helper.allowList([
    "div.bbcode-textmessage",
    "div.bbcode-textmessage-name",
    "div.bbcode-textmessage-overflow",
    "div.bbcode-textmessage-content",
  ]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
