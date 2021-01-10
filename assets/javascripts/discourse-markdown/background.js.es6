/**
 * @file Adds [bg] to bbcode
 * @example [bg=red]text[/bg]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption((siteSettings, opts) => (opts.features["rpn-bbcode"] = true));

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("bg", {
    tag: "bg",
    before: function (state, tagInfo) {
      let bgOption = tagInfo.attrs["_default"];
      let token = state.push("div_open", "div", 1);
      token.attrs = [
        ["class", "bbcode-background"],
        ["style", "background-color: " + bgOption],
      ];
    },
    after: function (state) {
      state.push("div_close", "div", -1);
    },
  });
}

export function setup(helper) {
  helper.allowList(["div.bbcode-background"]);

  helper.allowList({
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        return /^(background\-color:(.*))$/.exec(value);
      }
    },
  });
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
