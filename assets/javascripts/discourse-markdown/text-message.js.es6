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
  const INLINE_RULER = md.inline.bbcode.ruler;

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

      token = state.push("inline", "", 0);
      content = content.replace("\n", "");
      token.content = content;
      token.children = [];

      state.push("div_close", "div", -1);

      state.push("div_close", "div", -1);

      state.push("div_close", "div", -1);
      return true;
    },
  });

  INLINE_RULER.push("message", {
    tag: "message",
    replace: function (state, tagInfo, content) {
      let option = tagInfo.attrs["_default"] ?? "me";
      if (option === "left") {
        option = "them";
      }
      if (option === "right") {
        option = "me";
      }
      if (!(option === "me" || option === "them" || option === "left" || option === "right")) {
        option = "me";
      }
      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", `bbcode-message-${option}`]];
      token = state.push("text", "", 0);
      token.content = content;
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
    "div.bbcode-message-them",
    "div.bbcode-message-me",
  ]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
