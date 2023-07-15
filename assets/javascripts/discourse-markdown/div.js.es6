/**
 * @file Adds [color] to bbcode
 * @example [color=red]text[/color]
 */
import { registerOption } from "pretty-text/pretty-text";
import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";
// import { getClassPrefixer } from "./bbcode-helpers";

registerOption((siteSettings, opts) => (opts.features["div"] = !!siteSettings.rpn_bbcode_enabled));

function setupMarkdownIt(md) {
  const TEXT_RULER = md.core.textPostProcess.ruler;

  TEXT_RULER.push("div_open", {
    matcher: /(\[div=(.*?)\])/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      let token = new state.Token("div_open", "div", 1);
      const styleAttr = tagInfo.attrs["_default"];

      // Check if the style attribute contains an image URL
      const isImageUrl = styleAttr.includes("url(");

      if (isImageUrl) {
        // If an image URL is present, remove the <a> tag from the style attribute
        const cleanStyleAttr = styleAttr.replace(/<a\b[^>]*>(.*?)<\/a>/gi, "");
        token.attrs = [["style", cleanStyleAttr]];
      } else {
        token.attrs = [["style", styleAttr]];
      }

      buffer.push(token);
    },
  });

  TEXT_RULER.push("div_close", {
    matcher: /(\[\/div\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_close", "div", -1);
      buffer.push(token);
    },
  });
}

export function setup(helper) {
  helper.allowList(["div.bbcode-inline"]);
  helper.allowList({
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        //return /^[\s\S]+$/.exec(value);
        return true;
      }
    },
  });

  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
