/**
 * @file Adds [size] to bbcode
 * @example [size=2]content[/size]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption((siteSettings, opts) => (opts.features["size"] = !!siteSettings.rpn_bbcode_enabled));

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

  BLOCK_RULER.push("size", {
    tag: "size",
    before: function (state, tagInfo) {
      const fontSize = parseFontSize(tagInfo.attrs["_default"]);
      let token = state.push("div_open", "div", 1);
      if (fontSize.valid) {
        token.attrs = fontSize.unit
          ? [["style", `font-size:${fontSize.value}${fontSize.unit}`]]
          : [["class", `bbcode-size-${fontSize.value}`]];
      }
    },
    after: function (state) {
      state.push("div_close", "div", -1);
    },
  });

  INLINE_RULER.push("size", {
    tag: "size",
    wrap: function (startToken, endToken, tagInfo) {
      const fontSize = parseFontSize(tagInfo.attrs["_default"]);
      startToken.type = "span_open";
      startToken.tag = "span";
      if (fontSize.valid) {
        startToken.attrs = fontSize.unit
          ? [["style", `font-size:${fontSize.value}${fontSize.unit}`]]
          : [["class", `bbcode-size-${fontSize.value}`]];
      }
      startToken.content = "";
      startToken.nesting = 1;

      endToken.type = "span_close";
      endToken.tag = "span";
      endToken.content = "";
      endToken.nesting = -1;
    },
  });
}

export function setup(helper) {
  helper.allowList([
    "div.bbcode-size-1",
    "div.bbcode-size-2",
    "div.bbcode-size-3",
    "div.bbcode-size-4",
    "div.bbcode-size-5",
    "div.bbcode-size-6",
    "div.bbcode-size-7",
    "span.bbcode-size-1",
    "span.bbcode-size-2",
    "span.bbcode-size-3",
    "span.bbcode-size-4",
    "span.bbcode-size-5",
    "span.bbcode-size-6",
    "span.bbcode-size-7",
  ]);

  helper.allowList({
    custom(tag, name, value) {
      if ((tag === "div" || tag === "span") && name === "style") {
        return /^font-size:(\d+\.?\d?)(px|rem)$/.exec(value);
      }
    },
  });

  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
