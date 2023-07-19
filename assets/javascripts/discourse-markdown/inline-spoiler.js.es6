/**
 * @file Adds [inlineSpoiler] to bbcode
 * @example [inlineSpoiler]text[/inlineSpoiler]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["inline-spoiler"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const INLINE_RULER = md.inline.bbcode.ruler;

  INLINE_RULER.push("inlinespoiler", {
    tag: "inlinespoiler",
    wrap: "span.inlineSpoiler",
  });
}

export function setup(helper) {
  helper.allowList(["span.inlineSpoiler"]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
