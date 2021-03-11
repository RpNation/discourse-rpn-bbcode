/**
 * @file Adds [accordion] to bbcode
 * @example [accordion][slide=title]content[/slide][/accordion]
 */
import { registerOption } from "pretty-text/pretty-text";
import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";

registerOption(
  (siteSettings, opts) => (opts.features["accordion"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  // const BLOCK_RULER = md.block.bbcode.ruler;
  const TEXT_RULER = md.core.textPostProcess.ruler;

  // BLOCK_RULER.push("accordion", {
  //   tag: "accordion",
  //   wrap: "div.bbcode-accordion",
  // });

  TEXT_RULER.push("accordion_open", {
    matcher: /(\[accordion(=.*)?\])/gi,
    onMatch: function (buffer, matches, state) {
      // const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      // TODO ADD accordion options

      let token = new state.Token("div_open", "div", 1);
      token.attrs = [["class", "bbcode-accordion"]];
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

  TEXT_RULER.push("slide_open", {
    matcher: /(\[slide(=.*)?\])/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      // add slide options
      let token = new state.Token("button_open", "button", 1);
      token.attrs = [["class", "bbcode-slide-title"]];
      token.content = tagInfo.attrs["_default"];
      buffer.push(token);
      token = new state.Token("button_close", "button", -1);
      buffer.push(token);
      token = new state.Token("div_open", "div", 1);
      token.attrs = [["class", "bbcode-slide-content"]];
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
  ]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
