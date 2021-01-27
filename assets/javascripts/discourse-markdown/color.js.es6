/**
 * @file Adds [color] to bbcode
 * @example [color=red]text[/color]
 */
import { registerOption } from "pretty-text/pretty-text";
import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";
import { wrap } from "./bbcode-helpers";

registerOption(
  (siteSettings, opts) => (opts.features["color"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const INLINE_RULER = md.inline.bbcode.ruler;
  const BLOCK_RULER = md.block.bbcode.ruler;
  const TEXT_RULER = md.core.textPostProcess.ruler;

  BLOCK_RULER.push("color", {
    tag: "color",
    before: function (state, tagInfo) {
      let token = state.push("div_open", "div", 1);
      token.attrs = [["style", `color:${tagInfo.attrs["_default"]}`]];
    },
    after: function (state) {
      state.push("div_close", "div", -1);
    },
  });

  INLINE_RULER.push("color", {
    tag: "color",
    wrap: wrap("span", "style", (tagInfo) => `color:${tagInfo.attrs["_default"]}`),
  });

  TEXT_RULER.push("color_open", {
    matcher: /(\[color=(.*?)\])/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      let token = new state.Token("div_open", "div", 1);
      token.attrs = [
        ["style", `color:${tagInfo.attrs["_default"]}`],
        ["class", "bbcode-inline"],
      ];
      buffer.push(token);
    },
  });
  TEXT_RULER.push("color_close", {
    matcher: /(\[\/color\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_close", "div", -1);
      buffer.push(token);
    },
  });
  md.utils.isWhiteSpace = () => true; //lets the text rulers not need white space padding to be parsed
}

export function setup(helper) {
  helper.allowList(["div.bbcode-inline"]);
  helper.allowList({
    custom(tag, name, value) {
      if ((tag === "div" || tag === "span") && name === "style") {
        return /^color:(\w+)$/.exec(value);
      }
    },
  });

  helper.allowList({
    custom(tag, name, value) {
      if ((tag === "div" || tag === "span") && name === "style") {
        return /^color:\#[0-9a-fA-F]{6}$/.exec(value);
      }
    },
  });

  helper.allowList({
    custom(tag, name, value) {
      if ((tag === "div" || tag === "span") && name === "style") {
        return /^color:rgb\([0-9]{1,3},\s?[0-9]{1,3},\s?[0-9]{1,3}\)$/.exec(value);
      }
    },
  });

  helper.allowList({
    custom(tag, name, value) {
      if ((tag === "div" || tag === "span") && name === "style") {
        return /^color:rgba\([0-9]{1,3},\s?[0-9]{1,3},\s?[0-9]{1,3},\s?(1|0|0\.[0-9]{0,2})\)$/.exec(
          value
        );
      }
    },
  });

  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
