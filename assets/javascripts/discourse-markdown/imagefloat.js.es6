/**
 * @file Adds the [imageFloat=] tag
 * Allows anything inside to float to the left, right, or center
 * @example [imageFloat=right]test[/imageFloat]
 */
import { registerOption } from "pretty-text/pretty-text";
import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";
// import { wrap } from "./bbcode-helpers";

registerOption(
  (siteSettings, opts) => (opts.features["imagefloat"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  // const INLINE_RULER = md.inline.bbcode.ruler;
  // const BLOCK_RULER = md.block.bbcode.ruler;
  const TEXT_RULER = md.core.textPostProcess.ruler;

  // BLOCK_RULER.push("imagefloat", {
  //   tag: "imagefloat",
  //   wrap: function (token, tagInfo) {
  //     token.attrs = [["class", "float-" + tagInfo.attrs["_default"]]];
  //     return true;
  //   },
  // });

  // INLINE_RULER.push("imagefloat", {
  //   tag: "imagefloat",
  //   wrap: wrap("div", "class", (tagInfo) => "float-" + tagInfo.attrs._default.trim()),
  // });

  TEXT_RULER.push("imagefloat_open", {
    matcher: /(\[imagefloat=(.*?)\])/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      let token = new state.Token("div_open", "div", 1);
      token.attrs = [["class", "float-" + tagInfo.attrs["_default"]]];
      buffer.push(token);
    },
  });
  TEXT_RULER.push("imagefloat_close", {
    matcher: /(\[\/imagefloat\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_close", "div", -1);
      buffer.push(token);
    },
  });
}

export function setup(helper) {
  helper.allowList(["div.float-right", "div.float-left", "div.float-center"]);

  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
