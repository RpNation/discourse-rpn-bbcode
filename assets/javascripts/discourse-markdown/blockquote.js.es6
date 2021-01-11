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
      let author = tagInfo.attrs["_default"];

      let token = state.push("table_open", "table", 1);
      token.attrs = [["class", "bbcode-blockquote"]];

      state.push("tr_open", "tr", 1);

      token = state.push("td_open", "td", 1);
      token.attrs = [["class", "bbcode-blockquote-left"]];

      state.push("td_close", "td", -1);

      token = state.push("td_open", "td", 1);
      token.attrs = [["class", "bbcode-blockquote-content"]];

      token = state.push("inline", "", 0);
      token.content = content;
      token.children = [];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-blockquote-speaker"]];

      token = state.push("text", "", 0);
      token.content = author;

      state.push("div_close", "div", -1);

      state.push("td_close", "td", -1);

      token = state.push("td_open", "td", 1);
      token.attrs = [["class", "bbcode-blockquote-right"]];

      state.push("td_close", "td", -1);

      state.push("tr_close", "tr", -1);

      state.push("table_close", "table", -1);

      return true;
    },
  });
}

export function setup(helper) {
  helper.allowList([
    "table.bbcode-blockquote",
    "td.bbcode-blockquote-left",
    "td.bbcode-blockquote-content",
    "div.bbcode-blockquote-speaker",
    "td.bbcode-blockquote-right",
  ]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
