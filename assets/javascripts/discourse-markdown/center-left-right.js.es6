/**
 * @file Adds [center] [left] and [right] to bbcode
 * @example [center]content[/center]
 */
import { registerOption } from "pretty-text/pretty-text";
import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";

registerOption(
  (siteSettings, opts) => (opts.features["center-left-right"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  // const INLINE_RULER = md.inline.bbcode.ruler;
  // const BLOCK_RULER = md.block.bbcode.ruler;
  const TEXT_RULER = md.core.textPostProcess.ruler;

  // BLOCK_RULER.push("center", {
  //   tag: "center",
  //   wrap: "div.bbcode-content-center",
  // });

  // INLINE_RULER.push("center", {
  //   tag: "center",
  //   wrap: "div.bbcode-content-center",
  // });

  // BLOCK_RULER.push("left", {
  //   tag: "left",
  //   wrap: "div.bbcode-content-left",
  // });

  // INLINE_RULER.push("left", {
  //   tag: "left",
  //   wrap: "div.bbcode-content-left",
  // });

  // BLOCK_RULER.push("right", {
  //   tag: "right",
  //   wrap: "div.bbcode-content-right",
  // });

  // INLINE_RULER.push("right", {
  //   tag: "right",
  //   wrap: "div.bbcode-content-right",
  // });

  TEXT_RULER.push("text_align_open", {
    matcher: /(\[(left|center|right)\])/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      const option = tagInfo.tag;
      let token = new state.Token("div_open", "div", 1);
      token.attrs = [["class", `bbcode-content-${option}`]];
      buffer.push(token);
    },
  });

  TEXT_RULER.push("text_align_close", {
    matcher: /(\[\/(left|center|right)\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_close", "div", -1);
      buffer.push(token);
    },
  });
}

export function setup(helper) {
  helper.allowList([
    "div.bbcode-content-center",
    "div.bbcode-content-left",
    "div.bbcode-content-right",
  ]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
