/**
 * @file Adds [border] to bbcode
 * @example [border=1px solid red]content[/border]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["border"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("border", {
    tag: "border",
    before: function (state, tagInfo) {
      let styleOption = tagInfo.attrs["_default"];
      let token = state.push("div_open", "div", 1);
      token.attrs = [
        ["class", "bbcode-border"],
        ["style", "border: " + styleOption],
      ];
    },
    after: function (state) {
      state.push("div_close", "div", -1);
    },
  });
}

export function setup(helper) {
  helper.allowList(["div.bbcode-border"]);
  helper.allowList({
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        return /^(border:(.*))$/.exec(value);
      }
    },
  });
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
