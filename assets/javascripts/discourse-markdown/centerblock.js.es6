/**
 * @file Adds [centerblock] to bbcode
 * @example [centerblock=80]text[/color]
 */
import { registerOption } from "pretty-text/pretty-text";
import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";

registerOption(
  (siteSettings, opts) => (opts.features["centerblock"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const TEXT_RULER = md.core.textPostProcess.ruler;

  TEXT_RULER.push("centerblock_open", {
    matcher: /(\[centerblock=(.*?)\])/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      let token = new state.Token("div_open", "div", 1);
      token.attrs = [["style", `margin: 0 auto; width:${tagInfo.attrs["_default"]}%`]];
      buffer.push(token);
    },
  });
  TEXT_RULER.push("centerblock_close", {
    matcher: /(\[\/centerblock\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_close", "div", -1);
      buffer.push(token);
    },
  });
}

export function setup(helper) {
  helper.allowList({
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        return /^margin: 0 auto; width:(\d+)%$/.exec(value);
      }
    },
  });

  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
