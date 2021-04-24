/**
 * @file Adds [ispoiler] to bbcode
 * @example [ispoiler]text[/ispoiler]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["ispoiler"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const INLINE_RULER = md.inline.bbcode.ruler;

  INLINE_RULER.push("ispoiler", {
    tag: "ispoiler",
    wrap: "span.ispoiler",
  });
}

export function setup(helper) {
  helper.allowList(["span.ispoiler"]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
