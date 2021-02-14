/**
 * @file Adds [spoiler] to bbcode
 * @example [spoiler=title]content[/spoiler]
 */
import { registerOption } from "pretty-text/pretty-text";
import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";

registerOption(
  (siteSettings, opts) => (opts.features["spoiler"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  // const BLOCK_RULER = md.block.bbcode.ruler;
  const TEXT_RULER = md.core.textPostProcess.ruler;

  // BLOCK_RULER.push("spoiler", {
  //   tag: "spoiler",
  //   before: function (state, tagInfo) {
  //     let title = tagInfo.attrs["_default"];
  //     let token = state.push("div_open", "div", 1);
  //     token.attrs = [["class", "bbcode-spoiler"]];

  //     token = state.push("button_open", "button", 1);
  //     token.attrs = [["class", "bbcode-spoiler-button"]];
  //     token = state.push("text", "", 0);
  //     if (!title) {
  //       token.content = "Spoiler";
  //     } else {
  //       token.content = "Spoiler: " + title.trim();
  //     }
  //     state.push("button_close", "button", -1);

  //     token = state.push("div_open", "div", 1);
  //     token.attrs = [["class", "bbcode-spoiler-content"]];
  //   },
  //   after: function (state) {
  //     state.push("div_close", "div", -1);
  //     state.push("div_close", "div", -1);
  //     return true;
  //   },
  // });

  TEXT_RULER.push("spoiler_open", {
    matcher: /(\[spoiler(=.*)?\])/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      const title = tagInfo.attrs["_default"];
      let token = new state.Token("div_open", "div", 1);
      token.attrs = [["class", "bbcode-spoiler"]];
      buffer.push(token);
      token = new state.Token("button_open", "button", 1);
      token.attrs = [["class", "bbcode-spoiler-button"]];
      buffer.push(token);
      token = new state.Token("text", "", 0);
      if (!title) {
        token.content = "Spoiler";
      } else {
        token.content = "Spoiler: " + title.trim();
      }
      buffer.push(token);
      token = new state.Token("button_close", "button", -1);
      buffer.push(token);

      token = new state.Token("div_open", "div", 1);
      token.attrs = [["class", "bbcode-spoiler-content"]];
      buffer.push(token);
    },
  });
  TEXT_RULER.push("spoiler_close", {
    matcher: /(\[\/spoiler\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_close", "div", -1);
      buffer.push(token);
      token = new state.Token("div_close", "div", -1);
      buffer.push(token);
    },
  });
}

export function setup(helper) {
  helper.allowList([
    "div.bbcode-spoiler",
    "button.bbcode-spoiler-button",
    "div.bbcode-spoiler-content",
  ]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
