/**
 * @file Adds [check] to bbcode
 * @example [check=dot]text[/check]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["check"] = !!siteSettings.rpn_bbcode_enabled)
);

function wrap(tag, attr, callback) {
  return function (startToken, finishToken, tagInfo) {
    startToken.tag = finishToken.tag = tag;
    startToken.content = finishToken.content = "";

    startToken.type = "bbcode_open";
    finishToken.type = "bbcode_close";

    startToken.nesting = 1;
    finishToken.nesting = -1;

    startToken.attrs = [[attr, callback ? callback(tagInfo) : tagInfo.attrs._default]];
  };
}

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
