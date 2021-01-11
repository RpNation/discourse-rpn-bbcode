/**
 * @file Adds [mail] to bbcode
 * @example [mail=send][person]guy[/person][subject]hello[/subject]content[/mail]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption((siteSettings, opts) => (opts.features["mail"] = !!siteSettings.rpn_bbcode_enabled));

function setupMarkdownIt(md) {
  const INLINE_RULER = md.inline.bbcode.ruler;
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("mail", {
    tag: "mail",
    replace: function (state, tagInfo, content) {
      let mailOption = tagInfo.attrs["_default"];

      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-" + mailOption]];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-top-send"]];

      token = state.push("text", "", 0);
      token.content = "Send New Email";

      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-top-receive"]];

      token = state.push("text", "", 0);
      token.content = "New Email Received";

      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-first-row"]];

      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-second-row"]];

      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-main"]];

      token = state.push("inline", "", 0);
      token.content = content;
      token.children = [];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-footer"]];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-button"]];

      state.push("div_close", "div", -1);

      state.push("div_close", "div", -1);

      state.push("div_close", "div", -1);

      return true;
    },
  });

  INLINE_RULER.push("person", {
    tag: "person",
    wrap: function (startToken, endToken, tagInfo, content) {
      startToken.type = "div_open";
      startToken.tag = "div";
      startToken.attrs = [["class", "bbcode-email-person"]];
      startToken.content = content;
      startToken.nesting = 1;

      endToken.type = "div_close";
      endToken.tag = "div";
      endToken.content = "";
      endToken.nesting = -1;
    },
  });

  INLINE_RULER.push("subject", {
    tag: "subject",
    wrap: function (startToken, endToken, tagInfo, content) {
      startToken.type = "div_open";
      startToken.tag = "div";
      startToken.attrs = [["class", "bbcode-email-subject"]];
      startToken.content = content;
      startToken.nesting = 1;

      endToken.type = "div_close";
      endToken.tag = "div";
      endToken.content = "";
      endToken.nesting = -1;
    },
  });
}

export function setup(helper) {
  helper.allowList([
    "div.bbcode-email-send",
    "div.bbcode-email-receive",
    "div.bbcode-email-top-send",
    "div.bbcode-email-top-receive",
    "div.bbcode-email-first-row",
    "div.bbcode-email-second-row",
    "div.bbcode-email-main",
    "div.bbcode-email-footer",
    "div.bbcode-email-button",
    "div.bbcode-email-person",
    "div.bbcode-email-subject",
  ]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
