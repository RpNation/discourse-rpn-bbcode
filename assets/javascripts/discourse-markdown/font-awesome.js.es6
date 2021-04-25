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

  for (let i = 0; i < tagAttributes.length; i++) {
    if (tagAttributes[i] === "fa") {
      iconStyles.classes = `${iconStyles.classes} far`;
    }
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
        let iconAttributes = handleIconStyles(tagAttributes);
        let token = state.push("icon_open", "i", 1);
        if (iconAttributes.length) {
          token.attrs = [...iconAttributes, ["data-bbcode-font-awesome", "true"]];
        }
        token = state.push("icon_close", "i", -1);
        return true;
      }
    },
  });
}

export function setup(helper) {
  helper.allowList([
    "svg[class=*]",
    "svg[style=*]",
    "use[href=*]",
    "i[class=*]",
    "i[data-bbcode-font-awesome=*]",
  ]);
  helper.allowList({
    custom(tag, name, value) {
      if (tag === "i" && name === "style") {
        return /^(--fa-(.*?);(\s?))+$/.exec(value);
      }
    },
  });
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
