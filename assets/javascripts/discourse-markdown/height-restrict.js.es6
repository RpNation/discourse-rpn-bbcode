/**
 * @file Adds [heightrestrict] to bbcode where input is in px
 * @example [heightrestrict=100]img[/heightrestrict]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["height-restrict"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("heightrestrict", {
    tag: "heightrestrict",
    wrap: function (token, tagInfo) {
      token.attrs = [
        ["class", "bbcode-height-restrict"],
        ["style", "height: " + tagInfo.attrs["_default"] + "px;"],
      ];
      return true;
    },
  });
}

export function setup(helper) {
  helper.allowList(["div.bbcode-height-restrict"]);

  helper.allowList({
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        return /^(height: [0-9]*px;)$/.exec(value);
      }
    },
  });
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
