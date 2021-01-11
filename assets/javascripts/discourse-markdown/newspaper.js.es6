/**
 * @file Adds [newspaper] to bbcode
 * @example [newspaper]content[/newspaper]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["newspaper"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const INLINE_RULER = md.inline.bbcode.ruler;
  const BLOCK_RULER = md.block.bbcode.ruler;

  INLINE_RULER.push("newspaper", {
    tag: "newspaper",
    wrap: "div.bbcode-newspaper",
  });

  BLOCK_RULER.push("newspaper", {
    tag: "newspaper",
    wrap: "div.bbcode-newspaper",
  });
}

export function setup(helper) {
  helper.allowList(["div.bbcode-newspaper"]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
