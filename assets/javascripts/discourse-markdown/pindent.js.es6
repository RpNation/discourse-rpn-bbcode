/**
 * @file Adds [pindent] to bbcode
 * @example [pindent]text[/pindent]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["pindent"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const INLINE_RULER = md.inline.bbcode.ruler;

  INLINE_RULER.push("pindent", {
    tag: "pindent",
    wrap: function (startToken, endToken, tagInfo, content) {
      startToken.type = "span_open";
      startToken.tag = "span";
      startToken.attrs = [["style", "display: inline-block; text-indent:2.5em"]];
      startToken.content = content;
      startToken.nesting = 1;

      endToken.type = "span_close";
      endToken.tag = "span";
      endToken.content = "";
      endToken.nesting = -1;
    },
  });
}

export function setup(helper) {
  helper.allowList({
    custom(tag, name, value) {
      if (tag === "span" && name === "style") {
        return /^(display: inline-block; text-indent:2\.5em)$/.exec(value);
      }
    },
  });
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
