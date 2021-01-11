/**
 * @file Adds [note] to bbcode
 * @example [note]text[/note]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption((siteSettings, opts) => (opts.features["note"] = !!siteSettings.rpn_bbcode_enabled));

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("note", {
    tag: "note",
    replace: function (state, tagInfo, content) {
      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-note"]];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-note-tape"]];

      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-note-content"]];

      token = state.push("inline", "", 0);
      token.content = content;
      token.children = [];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-note-footer"]];

      state.push("div_close", "div", -1);

      state.push("div_close", "div", -1);

      state.push("div_close", "div", -1);

      return true;
    },
  });
}

export function setup(helper) {
  helper.allowList([
    "div.bbcode-note",
    "div.bbcode-note-tape",
    "div.bbcode-note-content",
    "div.bbcode-note-footer",
  ]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
