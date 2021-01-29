/**
 * @file Adds [indent] to bbcode
 * @example [indent]text[/indent]
 */
import { registerOption } from "pretty-text/pretty-text";
import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";

registerOption(
  (siteSettings, opts) => (opts.features["indent"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const TEXT_RULER = md.core.textPostProcess.ruler;

  TEXT_RULER.push("indent_open", {
    matcher: /(\[indent(=[1-9])?\])/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      let margin = parseInt(tagInfo.attrs["_default"] || "1", 10);
      let token = new state.Token("div_open", "div", 1);
      token.attrs = [
        ["style", `margin-left:${20 * margin}px`],
        ["class", "bbcode-inline-block"],
      ];
      buffer.push(token);
    },
  });
  TEXT_RULER.push("indent_close", {
    matcher: /(\[\/indent\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_close", "div", -1);
      buffer.push(token);
    },
  });
}

export function setup(helper) {
  helper.allowList(["div.bbcode-inline-block"]);
  helper.allowList({
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        return /^(margin-left:(2|4|6|8|10)0px)$/.exec(value);
      }
    },
  });
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
