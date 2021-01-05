/**
 * @file Adds the [imageFloat=] tag
 * Allows anything inside to float to the left, right, or center
 * @example [imageFloat=right]test[/imageFloat]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption((siteSettings, opts) => (opts.features["rpn-bbcode"] = true));

function wrap(tag, attr, callback) {
  return function (startToken, finishToken, tagInfo) {
    startToken.tag = finishToken.tag = tag;
    startToken.content = finishToken.content = "";

    startToken.type = "bbcode_open";
    finishToken.type = "bbcode_close";

    startToken.nesting = 1;
    finishToken.nesting = -1;

    startToken.attrs = [[attr, callback ? callback(tagInfo) : tagInfo.attrs._default]];
  };
}

function setupMarkdownIt(md) {
  const INLINE_RULER = md.inline.bbcode.ruler;
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("imagefloat", {
    tag: "imagefloat",
    wrap: function (token, tagInfo) {
      token.attrs = [["class", "float-" + tagInfo.attrs["_default"]]];
      return true;
    },
  });

  INLINE_RULER.push("imagefloat", {
    tag: "imagefloat",
    wrap: wrap("div", "class", (tagInfo) => "float-" + tagInfo.attrs._default.trim()),
  });
}

export function setup(helper) {
  helper.allowList(["div.float-right", "div.float-left", "div.float-center"]);

  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
