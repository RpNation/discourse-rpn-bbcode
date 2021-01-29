/**
 * @file Adds [bg] to bbcode
 * @example [bg=red]text[/bg]
 */
import { registerOption } from "pretty-text/pretty-text";
import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";

registerOption(
  (siteSettings, opts) => (opts.features["background"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  // const BLOCK_RULER = md.block.bbcode.ruler;
  const TEXT_RULER = md.core.textPostProcess.ruler;

  // BLOCK_RULER.push("bg", {
  //   tag: "bg",
  //   before: function (state, tagInfo) {
  //     let bgOption = tagInfo.attrs["_default"];
  //     let token = state.push("div_open", "div", 1);
  //     token.attrs = [
  //       ["class", "bbcode-background"],
  //       ["style", "background-color: " + bgOption],
  //     ];
  //   },
  //   after: function (state) {
  //     state.push("div_close", "div", -1);
  //   },
  // });

  TEXT_RULER.push("bg_open", {
    matcher: /(\[bg=((.*?)|(".*?"))\])/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      const bgOption = tagInfo.attrs["_default"];
      let token = new state.Token("div_open", "div", 1);
      token.attrs = [
        ["class", "bbcode-background"],
        ["style", "background-color: " + bgOption],
      ];
      buffer.push(token);
    },
  });
  TEXT_RULER.push("bg_close", {
    matcher: /(\[\/bg\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_close", "div", -1);
      buffer.push(token);
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
