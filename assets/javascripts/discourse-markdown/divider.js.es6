/**
 * @file Adds [divide] to bbcode
 * @example [divide=dotted]text[/divide]
 */
import { registerOption } from "pretty-text/pretty-text";
import { wrap } from "./bbcode-helpers";

registerOption(
  (siteSettings, opts) => (opts.features["divide"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const INLINE_RULER = md.inline.bbcode.ruler;

  INLINE_RULER.push("divide", {
    tag: "divide",
    wrap: wrap("span", "class", (tagInfo) =>
      !tagInfo.attrs["_default"]
        ? "bbcode-horizontal-rule"
        : "bbcode-horizontal-rule-" + tagInfo.attrs["_default"]
    ),
  });
}

export function setup(helper) {
  helper.allowList([
    "span.bbcode-horizontal-rule",
    "span.bbcode-horizontal-rule-thick",
    "span.bbcode-horizontal-rule-dotted",
    "span.bbcode-horizontal-rule-dotted-thick",
  ]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
