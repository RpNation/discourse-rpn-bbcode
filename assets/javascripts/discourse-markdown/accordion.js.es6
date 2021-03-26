/**
 * @file Adds [accordion] to bbcode
 * @example [accordion][slide=title]content[/slide][/accordion]
 */
import { registerOption } from "pretty-text/pretty-text";
import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";
import { generateFontTagAttributes } from "./font";

registerOption(
  (siteSettings, opts) => (opts.features["accordion"] = !!siteSettings.rpn_bbcode_enabled)
);

/**
 * parse the input string for old accordions
 * @param {string} input input string for accordion
 * @returns {object} parsed options
 */
function accordionParser(inputString) {
  const inputArray = inputString.split("|");
  const parsed = {};
  inputArray.forEach((input) => {
    input = input.trim();
    if (input.match(/(^\d+%$)/i)) {
      parsed.width = input;
    }
    if (input.match(/fleft/i)) {
      parsed.float = "left";
    }
    if (input.match(/fright/i)) {
      parsed.float = "right";
    }
    if (input.match(/bleft/i)) {
      // margin-right: auto;
      parsed.block = "left";
    }
    if (input.match(/bright/i)) {
      // margin-left: auto;
      parsed.block = "right";
    }
    if (input.match(/bcenter/i)) {
      // margin: 0 auto;
      parsed.block = "center";
    }
  });
  return parsed;
}

function setupMarkdownIt(md) {
  // const BLOCK_RULER = md.block.bbcode.ruler;
  const TEXT_RULER = md.core.textPostProcess.ruler;

  // BLOCK_RULER.push("accordion", {
  //   tag: "accordion",
  //   wrap: "div.bbcode-accordion",
  // });

  // [accordion width=50% block=right]

  TEXT_RULER.push("accordion_open", {
    matcher: /(\[accordion([= ](.*?))?\])/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      let parsed = {};
      if (tagInfo.attrs["_default"]) {
        parsed = accordionParser(tagInfo.attrs["_default"]);
      }
      const attrs = [];
      if (tagInfo.attrs.width || parsed.width) {
        const width = tagInfo.attrs.width || parsed.width;
        if (width.match(/(^\d+%$)/i)) {
          attrs.push(["style", `width: ${width};`]);
        }
      }
      if (tagInfo.attrs.block || parsed.block) {
        const block = tagInfo.attrs.block || parsed.block;
        if (["left", "right", "center"].includes(block)) {
          attrs.push(["data-bbcode-accordion-block", block]);
        }
      }
      if (tagInfo.attrs.float || parsed.float) {
        const float = tagInfo.attrs.float || parsed.float;
        if (float === "left" || float === "right") {
          attrs.push(["data-bbcode-accordion-float", float]);
        }
      }

      let token = new state.Token("div_open", "div", 1);
      token.attrs = [["class", "bbcode-accordion"], ...attrs];
      buffer.push(token);
    },
  });

  TEXT_RULER.push("accordion_close", {
    matcher: /(\[\/accordion\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_close", "div", -1);
      buffer.push(token);
    },
  });

  // BLOCK_RULER.push("slide", {
  //   tag: "slide",
  //   before: function (state, tagInfo) {
  //     let slideTitle = tagInfo.attrs["_default"];
  //     let token = state.push("button_open", "button", 1);
  //     token.attrs = [["class", "bbcode-slide-title"]];

  //     token = state.push("text", "", 0);
  //     token.content = slideTitle;

  //     state.push("button_close", "button", -1);

  //     token = state.push("div_open", "div", 1);
  //     token.attrs = [["class", "bbcode-slide-content"]];
  //   },
  //   after: function (state) {
  //     state.push("div_close", "div", -1);
  //   },
  // });

  // [slide title="title" align="right" font="" style="style" open]
  // TODO add font, color, size
  TEXT_RULER.push("slide_open", {
    matcher: /(\[slide([= ](.*?))?\])/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      // add slide options
      let token = new state.Token("button_open", "button", 1);
      const attrs = [];
      if (tagInfo.attrs.align) {
        attrs.push(["data-bbcode-slide-align", tagInfo.attrs.align]);
      }
      if (tagInfo.attrs.open) {
        attrs.push(["data-bbcode-slide-open", true]);
      }
      let fontParsed = generateFontTagAttributes({
        ...tagInfo.attrs,
        _default: tagInfo.attrs.font,
      });
      let styleValue = "";
      const style = fontParsed.find((e) => e[0] === "style");
      if (style) {
        fontParsed = fontParsed.filter((element) => element[0] !== "style");
        styleValue += style[1];
      }
      if (tagInfo.attrs.style) {
        styleValue += tagInfo.attrs.style;
      }
      attrs.push(["style", styleValue]);
      token.attrs = [
        ["class", "bbcode-slide-title"],
        ["data-bbcode-slide-new", true],
        ...fontParsed,
        ...attrs,
      ];
      buffer.push(token);
      token = new state.Token("text", "", 0);
      token.content = tagInfo.attrs["_default"] || tagInfo.attrs.title || "Slide";
      buffer.push(token);
      token = new state.Token("button_close", "button", -1);
      buffer.push(token);
      token = new state.Token("div_open", "div", 1);
      if (tagInfo.attrs.open) {
        token.attrs = [
          ["class", "bbcode-slide-content"],
          ["style", "display: block;"],
        ];
      } else {
        token.attrs = [["class", "bbcode-slide-content"]];
      }
      buffer.push(token);
    },
  });

  TEXT_RULER.push("slide_close", {
    matcher: /(\[\/slide\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_close", "div", -1);
      buffer.push(token);
    },
  });
}

export function setup(helper) {
  helper.allowList([
    "div.bbcode-accordion",
    "button.bbcode-slide-title",
    "div.bbcode-slide-content",
    "div[data-bbcode-accordion-block]",
    "div[data-bbcode-accordion-float]",
    "button[data-bbcode-slide-new]",
    "button[data-bbcode-slide-align]",
    "button[data-bbcode-slide-open]",
    "button[data-bbcode-gfont]",
  ]);
  helper.allowList({
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        return /^(width: \d+%;)$/.exec(value);
      }
    },
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        return /^(display: block;)$/.exec(value);
      }
    },
    custom(tag, name, value) {
      if (tag === "button" && name === "style") {
        return /^(.*)$/.exec(value);
      }
    },
  });
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
