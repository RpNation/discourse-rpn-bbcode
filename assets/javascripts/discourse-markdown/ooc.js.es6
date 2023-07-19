/**
 * @file Adds [ooc] to bbcode
 * @example [ooc]text[/ooc]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption((siteSettings, opts) => (opts.features["ooc"] = !!siteSettings.rpn_bbcode_enabled));

function setupMarkdownIt(md) {
  const INLINE_RULER = md.inline.bbcode.ruler;

  INLINE_RULER.push("ooc", {
    tag: "ooc",
    replace: function (state, tagInfo, content) {
      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-ooc"]];

      state.push("div_open", "div", 1);

      token = state.push("text", "", 0);
      token.content = "OOC";

      state.push("div_close", "div", -1);

      token = state.push("text", "", 0);
      token.content = content;

      state.push("div_close", "div", -1);

      return true;
    },
  });
}

export function setup(helper) {
  helper.allowList(["div.bbcode-ooc"]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
