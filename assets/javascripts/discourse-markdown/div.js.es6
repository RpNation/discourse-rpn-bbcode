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
      const attrs = [];
      
      // Parse and extract styles from the tag
      const styleMatch = /style=(['"])(.*?)\1/gi.exec(tagInfo.attrs["_default"]);
      if (styleMatch) {
        const styles = styleMatch[2];
        
        // Split styles by semicolon
        const styleList = styles.split(";");
        styleList.forEach((style) => {
          const [property, value] = style.split(":");
          
          // Trim property and value
          const trimmedProperty = property.trim();
          const trimmedValue = value.trim();
          
          // Handle background:url separately
          if (trimmedProperty === "background" && trimmedValue.startsWith("url(") && trimmedValue.endsWith(")")) {
            const url = trimmedValue.slice(4, -1).trim();
            attrs.push(["style", `background-image: url('${url}');`]);
          } else {
            attrs.push(["style", `${trimmedProperty}: ${trimmedValue};`]);
          }
        });
      }
      
      token.attrs = attrs;
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

