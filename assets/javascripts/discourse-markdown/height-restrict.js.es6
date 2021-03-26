/**
 * @file Adds [heightrestrict] to bbcode where input is in px
 * @example [heightrestrict=100]img[/heightrestrict]
 */
import { registerOption } from "pretty-text/pretty-text";
import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";

registerOption(
  (siteSettings, opts) => (opts.features["height-restrict"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  // const BLOCK_RULER = md.block.bbcode.ruler;
  const TEXT_RULER = md.core.textPostProcess.ruler;

  // BLOCK_RULER.push("heightrestrict", {
  //   tag: "heightrestrict",
  //   wrap: function (token, tagInfo) {
  //     token.attrs = [
  //       ["class", "bbcode-height-restrict"],
  //       ["style", "height: " + tagInfo.attrs["_default"] + "px;"],
  //     ];
  //     return true;
  //   },
  // });

  TEXT_RULER.push("heightrestrict_open", {
    matcher: /(\[heightrestrict=([0-9]+)\])/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      const height = tagInfo.attrs["_default"];
      let token = new state.Token("div_open", "div", 1);
      token.attrs = [
        ["class", "bbcode-background"],
        ["style", `height: ${height}px;`],
      ];
      buffer.push(token);
    },
  });

  TEXT_RULER.push("heightrestrict_close", {
    matcher: /(\[\/heightrestrict\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_close", "div", -1);
      buffer.push(token);
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
