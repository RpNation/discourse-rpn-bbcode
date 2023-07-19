/**
 * @file Adds [font] to bbcode
 * @example [font=Times new roman]text[/font]
 * @example [font family="Raleway" weight=number/name italics=true]
 */
import { registerOption } from "pretty-text/pretty-text";
import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";
import { parseFontSize } from "./bbcode-helpers";

registerOption((siteSettings, opts) => (opts.features["font"] = !!siteSettings.rpn_bbcode_enabled));

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

const WEIGHTS = {
  thin: 100,
  extralight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

/**
 * Generates the appropriate attributes for a token.
 * @param tagInfo.attrs pass in all attrs as an object
 */
export function generateFontTagAttributes({
  family,
  name = family,
  _default: fontFamily = name, //family, name, and _default are all the same anyway
  color,
  size,
  weight,
  italic,
  italics = italic, //default support both as it can get confusing
}) {
  let fontAttributes = [];
  let dataValue = "";
  let styleValue = "";

  const googleFont = fontFamily && !BASE_FONTS.includes(fontFamily.toLowerCase());

  if (fontFamily) {
    styleValue += `font-family: ${fontFamily},Helvetica,Arial,sans-serif;`;
    if (googleFont) {
      dataValue += fontFamily.trim().replace(/\s/g, "+");
    }
  }

  if (italics) {
    styleValue += "font-style: italic;";
    if (googleFont) {
      dataValue += ":ital" + (weight ? "" : "@1");
    }
  }

  if (weight) {
    weight = weight.toLowerCase().replace(/[ -]/g, "");
    const parsedNumber = Number.parseInt(weight, 10);
    let translatedWeight = 400;
    if (Number.isNaN(parsedNumber)) {
      translatedWeight = WEIGHTS[weight];
    } else {
      translatedWeight = Math.min(Math.max(parsedNumber, 1), 1000);
    }
    styleValue += `font-weight: ${translatedWeight};`;
    if (googleFont) {
      dataValue += `${dataValue.endsWith(":ital") ? "," : ":"}wght@${
        dataValue.endsWith(":ital") ? "1," : ""
      }${translatedWeight}`;
    }
  }

  if (size) {
    size = parseFontSize(size);
    if (size.valid) {
      if (size.unit) {
        styleValue += `font-size:${size.value}${size.unit};`;
      } else {
        fontAttributes.push(["class", `bbcode-size-${size.value}`]);
      }
    }
  }

  if (color) {
    styleValue += `color:${color};`;
  }

  if (styleValue.length) {
    fontAttributes.push(["style", styleValue]);
  }
  if (dataValue.length) {
    fontAttributes.push(["data-bbcode-gfont", dataValue]);
  }
  return fontAttributes;
}

function setupMarkdownIt(md) {
  // const INLINE_RULER = md.inline.bbcode.ruler;
  // const BLOCK_RULER = md.block.bbcode.ruler;
  const TEXT_RULER = md.core.textPostProcess.ruler;

  // BLOCK_RULER.push("font", {
  //   tag: "font",
  //   before: function (state, tagInfo) {
  //     let token = state.push("div_open", "div", 1);
  //     token.attrs = generateFontTagAttributes(tagInfo.attrs);
  //   },
  //   after: function (state) {
  //     state.push("div_close", "div", -1);
  //   },
  // });

  // INLINE_RULER.push("font", {
  //   tag: "font",
  //   wrap: function (startToken, endToken, tagInfo) {
  //     startToken.type = "span_open";
  //     startToken.tag = "span";
  //     startToken.attrs = generateFontTagAttributes(tagInfo.attrs);
  //     startToken.nesting = 1;
  //     startToken.content = "";

  //     endToken.type = "span_close";
  //     endToken.tag = "span";
  //     endToken.content = "";
  //     endToken.nesting = -1;
  //   },
  // });

  TEXT_RULER.push("font_open", {
    matcher: /(\[font[= ](.*?)\])/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      let token = new state.Token("div_open", "div", 1);
      token.attrs = generateFontTagAttributes(tagInfo.attrs);
      token.attrJoin("class", "bbcode-inline");
      buffer.push(token);
    },
  });
  TEXT_RULER.push("font_close", {
    matcher: /(\[\/font\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_close", "div", -1);
      buffer.push(token);
    },
  });
}

export function setup(helper) {
  helper.allowList(["div[data-bbcode-gfont=*]", "span[data-bbcode-gfont=*]", "div.bbcode-inline"]);
  helper.allowList({
    custom(tag, name, value) {
      if ((tag === "div" || tag === "span") && name === "style") {
        return /^(font-family: [\w\s]+,Helvetica,Arial,sans-serif;)?(font-style: italic;)?(font-weight: [0-9]+;)?(font-size:(\d+\.?\d?)(px|rem);)?(color:(\w+|#[0-9a-fA-F]{6}|rgb\([0-9]{1,3},\s?[0-9]{1,3},\s?[0-9]{1,3}\)|rgba\([0-9]{1,3},\s?[0-9]{1,3},\s?[0-9]{1,3},\s?(1|0|0\.[0-9]{0,2})\));)?$/.exec(
          value
        );
      }
    },
  });
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
