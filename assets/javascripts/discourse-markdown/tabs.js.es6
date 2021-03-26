/**
 * @file Adds [tabs] to bbcode
 * @example [tabs][tab=title]content[/tab][/tabs]
 */
import { registerOption } from "pretty-text/pretty-text";
import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";

registerOption((siteSettings, opts) => (opts.features["tabs"] = !!siteSettings.rpn_bbcode_enabled));

function setupMarkdownIt(md) {
  // const BLOCK_RULER = md.block.bbcode.ruler;
  const TEXT_RULER = md.core.textPostProcess.ruler;

  // BLOCK_RULER.push("tabs", {
  //   tag: "tabs",
  //   wrap: "div.bbcode-tab",
  // });

  // BLOCK_RULER.push("tab", {
  //   tag: "tab",
  //   before: function (state, tagInfo) {
  //     let tabTitle = tagInfo.attrs["_default"];

  //     let token = state.push("button_open", "button", 1);
  //     token.attrs = [["class", "bbcode-tab-links"]];

  //     token = state.push("text", "", 0);
  //     token.content = tabTitle;

  //     state.push("button_close", "button", -1);

  //     token = state.push("div_open", "div", 1);
  //     token.attrs = [["class", "bbcode-tab-content"]];
  //   },
  //   after: function (state) {
  //     state.push("div_close", "div", -1);
  //   },
  // });

  TEXT_RULER.push("tabs_open", {
    matcher: /(\[tabs\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_open", "div", 1);
      token.attrs = [["class", "bbcode-tab"]];
      buffer.push(token);
    },
  });

  TEXT_RULER.push("tabs_close", {
    matcher: /(\[\/tabs\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_close", "div", -1);
      buffer.push(token);
    },
  });

  TEXT_RULER.push("tab_open", {
    matcher: /(\[tab=(.*?)\])/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      let token = new state.Token("button_open", "button", 1);
      token.attrs = [["class", "bbcode-tab-links"]];
      buffer.push(token);
      token = new state.Token("text", "", 0);
      token.content = tagInfo.attrs["_default"];
      buffer.push(token);
      token = new state.Token("button_close", "button", -1);
      buffer.push(token);
      token = new state.Token("div_open", "div", 1);
      token.attrs = [["class", "bbcode-tab-content"]];
      buffer.push(token);
    },
  });

  TEXT_RULER.push("tab_close", {
    matcher: /(\[\/tab\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_close", "div", -1);
      buffer.push(token);
    },
  });
}

export function setup(helper) {
  helper.allowList(["div.bbcode-tab", "button.bbcode-tab-links", "div.bbcode-tab-content"]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
