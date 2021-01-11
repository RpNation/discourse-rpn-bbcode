/**
 * @file Adds [fa] to bbcode
 * @example [fa]fas fa-vial[/fa]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["font-awesome"] = !!siteSettings.rpn_bbcode_enabled)
);

function handleIconStyles(tagAttributes) {
  let currentMatch;
  const duotoneMatch = /(.*)\{(.*)\}/;
  let iconStyles = {
    classes: "",
    styles: "",
  };

  for (let i = 2; i < tagAttributes.length; i++) {
    if ((currentMatch = tagAttributes[i].match(duotoneMatch))) {
      iconStyles.styles = `${iconStyles.styles} --${currentMatch[1]}:${currentMatch[2]};`;
    } else {
      iconStyles.classes = `${iconStyles.classes} ${tagAttributes[i].trim()}`;
    }
  }

  let attributes = [];
  if (iconStyles.styles.length) {
    attributes.push(["style", iconStyles.styles]);
  }
  if (iconStyles.classes.length) {
    attributes.push(["class", iconStyles.classes]);
  }

  return attributes;
}

function setupMarkdownIt(md) {
  const INLINE_RULER = md.inline.bbcode.ruler;

  INLINE_RULER.push("fa", {
    tag: "fa",
    replace: function (state, tagInfo, content) {
      const tagAttributes = content.split(/\s/);
      if (tagAttributes.length > 1) {
        let iconType = tagAttributes[0].length === 2 ? "far" : tagAttributes[0];
        let iconReference = tagAttributes[1].replace(/fa\w*/, iconType);
        let iconAttributes = handleIconStyles(tagAttributes);
        let token = state.push("svg_open", "svg", 1);
        if (iconAttributes.length) {
          token.attrs = iconAttributes;
        }
        token = state.push("use_open", "use", 1);
        token.attrs = [["href", `#${iconReference}`]];
        token = state.push("use_close", "use", -1);
        token = state.push("svg_close", "svg", -1);
        return true;
      }
    },
  });
}

export function setup(helper) {
  helper.allowList(["svg[class=*]", "svg[style=*]", "use[href=*]"]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
