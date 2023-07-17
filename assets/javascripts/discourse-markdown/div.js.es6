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

function setupMarkdownIt(md) {
  const TEXT_RULER = md.core.textPostProcess.ruler;

  TEXT_RULER.push("div_open", {
    matcher: /(\[div=(.*?)\])/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      console.log(`I'm trying to match for Div! ${tagInfo}`)
      let token = new state.Token("div_open", "div", 1);
      let styleProps = tagInfo.attrs["_default"];
      if (hasBackgroundUrl(styleProps)) styleProps = addLinkifyEscapeCharacter(styleProps);
      token.attrs = [["style", styleProps]];
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

function hasBackgroundUrl(tagAttributes) {
  console.log(`Passed Tag Attr: ${tagAttributes}`);
  return /.*(background:url\().*/.test(tagAttributes);
}

function addLinkifyEscapeCharacter(styleProps) {
  console.log(`This tag had a background URL: ${styleProps}`);
  let testProps = styleProps.replace(/(https?\:)/, "$1\\");
  console.log(`New Props: ${testProps}`)
  return testProps;
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
