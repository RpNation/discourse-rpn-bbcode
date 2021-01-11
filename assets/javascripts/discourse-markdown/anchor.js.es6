/**
 * @file Adds [a] and [goto] to bbcode
 * @example [a=name]text[/a][goto=name]goto[/goto]
 */
import { registerOption } from "pretty-text/pretty-text";
import { wrap } from "./bbcode-helpers";

registerOption(
  (siteSettings, opts) => (opts.features["anchor"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const INLINE_RULER = md.inline.bbcode.ruler;

  INLINE_RULER.push("a", {
    tag: "a",
    wrap: wrap("a", "id", (tagInfo) => `user-anchor-${tagInfo.attrs._default}`),
  });

  INLINE_RULER.push("goto", {
    tag: "goto",
    wrap: wrap("a", "href", (tagInfo) => `#user-anchor-${tagInfo.attrs["_default"]}`),
  });
}

export function setup(helper) {
  helper.allowList({
    custom(tag, name, value) {
      if (tag === "a" && name === "href") {
        return /^#user-anchor-\w+$/.exec(value);
      }
    },
  });

  helper.allowList({
    custom(tag, name, value) {
      if (tag === "a" && name === "id") {
        return /^user-anchor-\w+$/.exec(value);
      }
    },
  });
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
