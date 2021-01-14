/**
 * @file Adds [blockquote] to bbcode
 * @example [blockquote=author]text[/blockquote]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["blockquote"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("blockquote", {
    tag: "blockquote",
    replace: function (state, tagInfo, content) {
      let author = (tagInfo.attrs["_default"] !== undefined && tagInfo.attrs["_default"] !== null) ? tagInfo.attrs["_default"] : "";
      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-blockquote"]];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-blockquote-left"]];
      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-blockquote-content"]];
      token = state.push("inline", "", 0);
      token.content = content;
      token.children = [];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-blockquote-speaker"]];
      token = state.push("text", "", 0);
      token.content = author;
      state.push("div_close", "div", -1);
      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-blockquote-right"]];
      state.push("div_close", "div", -1);

      state.push("div_close", "div", -1);
      return true;
    },
  });
}

export function setup(helper) {
  helper.allowList([
    "div.bbcode-blockquote",
    "div.bbcode-blockquote-content",
    "div.bbcode-blockquote-left",
    "div.bbcode-blockquote-right",
    "div.bbcode-blockquote-speaker",
  ]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
