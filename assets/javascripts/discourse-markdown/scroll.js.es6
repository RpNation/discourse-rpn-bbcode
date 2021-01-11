/**
 * @file Adds [scroll] to bbcode
 * @example [scroll=100px]scroll[/scroll]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["scroll"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("scroll", {
    tag: "scroll",
    wrap: function (token, tagInfo) {
      let heightOption = tagInfo.attrs["_default"];
      token.attrs = [
        [
          "style",
          "max-width: 100%; padding: 5px; overflow:auto; border: 1px solid; height:" +
            heightOption +
            ";",
        ],
      ];
      return true;
    },
  });
}

export function setup(helper) {
  helper.allowList({
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        return /^(max-width: 100%; padding: 5px; overflow:auto; border: 1px solid; height:[0-9]*px;)$/.exec(
          value
        );
      }
    },
  });
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
