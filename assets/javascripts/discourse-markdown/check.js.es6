/**
 * @file Adds [check] to bbcode
 * @example [check=dot]text[/check]
 */
import { registerOption } from "pretty-text/pretty-text";
import { wrap } from "./bbcode-helpers";

registerOption(
  (siteSettings, opts) => (opts.features["check"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const INLINE_RULER = md.inline.bbcode.ruler;

  INLINE_RULER.push("check", {
    tag: "check",
    wrap: wrap("div", "class", (tagInfo) => "bbcode-check-" + tagInfo.attrs._default.trim()),
  });
}

export function setup(helper) {
  helper.allowList(["div.bbcode-check-dot", "div.bbcode-check-check", "div.bbcode-check-cross"]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
