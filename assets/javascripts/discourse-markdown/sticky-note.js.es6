/**
 * @file Adds [note] to bbcode
 * @example [note]text[/note]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["stickynote"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("note", {
    tag: "note",
    before: function (state) {
      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-note"]];
      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-tape"]];
      state.push("div_close", "div", -1);
      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-note-content"]];
    },
    after: function (state) {
      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-note-footer"]];
      state.push("div_close", "div", -1);
      state.push("div_close", "div", -1);
      state.push("div_close", "div", -1);
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
