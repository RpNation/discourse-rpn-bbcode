/**
 * @file Adds [highlight] tag to bbcode
 * @example [highlight]text[/highlight]
 */

import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["highlight"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const INLINE_RULER = md.inline.bbcode.ruler;

  INLINE_RULER.push("highlight", {
    tag: "highlight",
    wrap: "span.bbcodeHighlight",
  });
}

export function setup(helper) {
  helper.allowList(["span.bbcodeHighlight"]);

  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
