/**
 * @file Adds [scroll] to bbcode
 * @example [scroll=100px]scroll[/scroll]
 */
import { registerOption } from "pretty-text/pretty-text";
import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";

registerOption(
  (siteSettings, opts) => (opts.features["scroll"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  // const BLOCK_RULER = md.block.bbcode.ruler;
  const TEXT_RULER = md.core.textPostProcess.ruler;

  // BLOCK_RULER.push("scroll", {
  //   tag: "scroll",
  //   wrap: function (token, tagInfo) {
  //     let heightOption = tagInfo.attrs["_default"];
  //     token.attrs = [
  //       [
  //         "style",
  //         "max-width: 100%; padding: 5px; overflow:auto; border: 1px solid; height:" +
  //           heightOption +
  //           ";",
  //       ],
  //     ];
  //     return true;
  //   },
  // });
  TEXT_RULER.push("side_open", {
    matcher: /\[scroll=(\d)*px\]/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      const heightOption = tagInfo.attrs["_default"];
      let token = new state.Token("div_open", "div", 1);
      token.attrs = [
        [
          "style",
          "max-width: 100%; padding: 5px; overflow:auto; border: 1px solid; height:" +
            heightOption +
            ";",
        ],
      ];
      buffer.push(token);
    },
  });

  TEXT_RULER.push("side_close", {
    matcher: /(\[\/side\])/gi,
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
