/**
 * @file Adds [div] to bbcode
 * @example [div=background-color:#77777]text[/div]
 */
import { registerOption } from "pretty-text/pretty-text";
import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";
// import { getClassPrefixer } from "./bbcode-helpers";

registerOption((siteSettings, opts) => {
  opts.features["div"] = !!siteSettings.rpn_bbcode_enabled;
});

const modifiedParseBBCodeTag = (tag, startPos, endPos) => {
  if (tag.tagName === "url") {
    return {
      tagName: "url",
      attrs: tag.attrs,
      content: tag.content,
      text: tag.content,
    };
  }

  return parseBBCodeTag(tag, startPos, endPos);
};

function setupMarkdownIt(md) {
  const TEXT_RULER = md.core.textPostProcess.ruler;

  TEXT_RULER.push("div_open", {
    matcher: /(\[div=(.*?)\])/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = modifiedParseBBCodeTag(matches[0], 0, matches[0].length);
      let token = new state.Token("div_open", "div", 1);
      token.attrs = [["style", tagInfo.attrs["_default"]]];
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
        return /^[\s\S]+$/.exec(value);
      }
    },
  });
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
