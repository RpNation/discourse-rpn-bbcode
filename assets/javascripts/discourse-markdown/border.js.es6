/**
 * @file Adds [border] to bbcode
 * @example [border=1px solid red]content[/border]
 */
import { registerOption } from "pretty-text/pretty-text";
import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";

registerOption(
  (siteSettings, opts) => (opts.features["border"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  // const BLOCK_RULER = md.block.bbcode.ruler;
  const TEXT_RULER = md.core.textPostProcess.ruler;

  // BLOCK_RULER.push("border", {
  //   tag: "border",
  //   before: function (state, tagInfo) {
  //     let styleOption = tagInfo.attrs["_default"];
  //     let token = state.push("div_open", "div", 1);
  //     token.attrs = [
  //       ["class", "bbcode-border"],
  //       ["style", "border: " + styleOption],
  //     ];
  //   },
  //   after: function (state) {
  //     state.push("div_close", "div", -1);
  //   },
  // });

  TEXT_RULER.push("border_open", {
    matcher: /(\[border=((.*?)|(".*?"))\])/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      const border = tagInfo.attrs["_default"];
      let token = new state.Token("div_open", "div", 1);
      token.attrs = [
        ["class", "bbcode-border"],
        ["style", "border: " + border],
      ];
      buffer.push(token);
    },
  });
  TEXT_RULER.push("border_close", {
    matcher: /(\[\/border\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_close", "div", -1);
      buffer.push(token);
    },
  });
  md.utils.isWhiteSpace = () => true; //lets the text rulers not need white space padding to be parsed
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
