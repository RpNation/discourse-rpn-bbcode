/**
 * @file Adds [nobr] to bbcode
 * @example [nobr]content[/nobr]
 *
 * Does this even work???
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption((siteSettings, opts) => (opts.features["nobr"] = !!siteSettings.rpn_bbcode_enabled));

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("nobr", {
    tag: "nobr",
    wrap: function (token) {
      let text = token.content;

      text = text.replace(/(\r\n|\n|\r)/gm, " ");
      token.content = text;
      return true;
    },
  });
}

export function setup(helper) {
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
