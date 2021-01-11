/**
 * @file Adds [center] [left] and [right] to bbcode
 * @example [center]content[/center]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["center-left-right"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const INLINE_RULER = md.inline.bbcode.ruler;
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("center", {
    tag: "center",
    wrap: "div.bbcode-content-center",
  });

  INLINE_RULER.push("center", {
    tag: "center",
    wrap: "div.bbcode-content-center",
  });

  BLOCK_RULER.push("left", {
    tag: "left",
    wrap: "div.bbcode-content-left",
  });

  INLINE_RULER.push("left", {
    tag: "left",
    wrap: "div.bbcode-content-left",
  });

  BLOCK_RULER.push("right", {
    tag: "right",
    wrap: "div.bbcode-content-right",
  });

  INLINE_RULER.push("right", {
    tag: "right",
    wrap: "div.bbcode-content-right",
  });
}

export function setup(helper) {
  helper.allowList([
    "div.bbcode-content-center",
    "div.bbcode-content-left",
    "div.bbcode-content-right",
  ]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
