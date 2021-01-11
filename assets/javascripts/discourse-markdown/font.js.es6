/**
 * @file Adds [font] to bbcode
 * @example [font=Times new roman]text[/font]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption((siteSettings, opts) => (opts.features["font"] = !!siteSettings.rpn_bbcode_enabled));

function parseFontSize(fontValue) {
  let value;
  let fontSize = { valid: true };
  const parsedSize = /(\d+\.?\d?)(px|rem)?/.exec(fontValue);
  const sizeRanges = {
    px_max: 36,
    px_min: 8,
    rem_max: 3,
    rem_min: 0.2,
    unitless_max: 7,
    unitless_min: 1,
  };

  fontSize.unit = parsedSize[2];
  if ((value = parsedSize[1])) {
    switch (fontSize.unit) {
      case "px":
        if (value > sizeRanges.px_max) {
          value = sizeRanges.px_max;
        } else if (value < sizeRanges.px_min) {
          value = sizeRanges.px_min;
        }
        break;
      case "rem":
        if (value > sizeRanges.rem_max) {
          value = sizeRanges.rem_max;
        } else if (value < sizeRanges.rem_min) {
          value = sizeRanges.rem_min;
        }
        break;
      default:
        if ((fontSize.valid = fontValue.length === value.length)) {
          if (value > sizeRanges.unitless_max) {
            value = sizeRanges.unitless_max;
          } else if (value < sizeRanges.unitless_min) {
            value = sizeRanges.unitless_min;
          }
        }
        break;
    }

    fontSize.value = value;
  }
  return fontSize;
}

function setupMarkdownIt(md) {
  const INLINE_RULER = md.inline.bbcode.ruler;
  const BLOCK_RULER = md.block.bbcode.ruler;
  const BASE_FONTS = [
    "arial",
    "book antiqua",
    "courier new",
    "georgia",
    "tahoma",
    "times new roman",
    "trebuchet ms",
    "verdana",
  ];

  BLOCK_RULER.push("font", {
    tag: "font",
    replace: function (state, tagInfo, content) {
      const fontFamily =
        tagInfo.attrs["_default"] || tagInfo.attrs["family"] || tagInfo.attrs["name"];
      const fontColor = tagInfo.attrs["color"];
      const fontSize = tagInfo.attrs["size"];

      let token;
      if (fontFamily && !BASE_FONTS.includes(fontFamily.toLowerCase())) {
        addFontLinkTag(token, state, fontFamily);
      }

      token = state.push("div_open", "div", 1);
      token.attrs = generateFontTagAttributes(fontFamily, fontSize, fontColor);
      token = state.push("inline", "", 0);
      token.content = content;
      token.children = [];
      state.push("div_close", "div", -1);
      return true;
    },
  });

  INLINE_RULER.push("font", {
    tag: "font",
    replace: function (state, tagInfo, content) {
      const fontFamily =
        tagInfo.attrs["_default"] || tagInfo.attrs["family"] || tagInfo.attrs["name"];
      const fontColor = tagInfo.attrs["color"];
      const fontSize = tagInfo.attrs["size"];

      let token;
      if (fontFamily && !BASE_FONTS.includes(fontFamily.toLowerCase())) {
        addFontLinkTag(token, state, fontFamily);
      }

      token = state.push("span_open", "span", 1);
      token.attrs = generateFontTagAttributes(fontFamily, fontSize, fontColor);

      let lineBreakRegex = /\r?\n/gm;
      const splitContent = content.trim().split(lineBreakRegex);
      const contentLength = splitContent.length - 1;

      for (let i = 0; i <= contentLength; ++i) {
        token = state.push("text", "", 0);
        token.content = splitContent[i];

        if (i !== contentLength) {
          state.push("br", "br", 0);
        }
      }

      state.push("span_close", "span", -1);
      return true;
    },
  });

  function addFontLinkTag(token, state, fontFamily) {
    token = state.push("link", "link", 0);
    token.attrs = [
      ["rel", "stylesheet"],
      ["type", "text/css"],
      ["href", `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s/g, "+")}`],
    ];
  }

  function generateFontTagAttributes(fontFamily, fontSize, fontColor) {
    let fontAttributes = [];
    let styleValue = "";
    if (fontFamily) {
      styleValue += `font-family:${fontFamily},Helvetica,Arial,sans-serif;`;
    }

    if (fontSize) {
      fontSize = parseFontSize(fontSize);
      if (fontSize.valid) {
        if (fontSize.unit) {
          styleValue += `font-size:${fontSize.value}${fontSize.unit};`;
        } else {
          fontAttributes.push(["class", `bbcode-size-${fontSize.value}`]);
        }
      }
    }

    if (fontColor) {
      styleValue += `color:${fontColor};`;
    }

    if (styleValue.length) {
      fontAttributes.push(["style", styleValue]);
    }
    return fontAttributes;
  }
}

export function setup(helper) {
  helper.allowList([
    "link[href=https://fonts.googleapis.com/*]",
    "link[rel=stylesheet]",
    "link[type=text/css]",
  ]);
  helper.allowList({
    custom(tag, name, value) {
      if ((tag === "div" || tag === "span") && name === "style") {
        return /^(font-family:[\w\s]+,Helvetica,Arial,sans-serif;)?(font-size:(\d+\.?\d?)(px|rem);)?(color:(\w+|#[0-9a-fA-F]{6}|rgb\([0-9]{1,3},\s?[0-9]{1,3},\s?[0-9]{1,3}\)|rgba\([0-9]{1,3},\s?[0-9]{1,3},\s?[0-9]{1,3},\s?(1|0|0\.[0-9]{0,2})\));)?$/.exec(
          value
        );
      }
    },
  });

  helper.allowList({
    custom(tag, name, value) {
      if (tag === "link" && name === "href") {
        return /^https\:\/\/fonts\.googleapis\.com\/css2\?family=(.*)$/.exec(value);
      }
    },
  });
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
