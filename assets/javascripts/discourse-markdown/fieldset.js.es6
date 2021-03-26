/**
 * @file Adds [fieldset] to bbcode
 * @example [fieldset=title]content[/fieldset]
 */
import { registerOption } from "pretty-text/pretty-text";
import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";

registerOption(
  (siteSettings, opts) => (opts.features["fieldset"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  // const BLOCK_RULER = md.block.bbcode.ruler;
  const TEXT_RULER = md.core.textPostProcess.ruler;

  // BLOCK_RULER.push("fieldset", {
  //   tag: "fieldset",
  //   before: function (state, tagInfo) {
  //     let token = state.push("fieldset_open", "fieldset", 1);
  //     token.attrs = [["class", "bbcode-fieldset"]];

  //     token = state.push("legend_open", "legend", 1);
  //     token.block = false;

  //     token = state.push("text", "", 0);
  //     token.content = tagInfo.attrs["_default"];

  //     token = state.push("legend_close", "legend", -1);

  //     token = state.push("span_open", "span", 1);
  //     token.block = false;
  //   },
  //   after: function (state) {
  //     state.push("span_close", "span", -1);
  //     state.push("fieldset_close", "fieldset", -1);
  //   },
  // });

  TEXT_RULER.push("fieldset_open", {
    matcher: /(\[fieldset=((.*?)|(".*?"))\])/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      const title = tagInfo.attrs["_default"];

      let token = new state.Token("fieldset_open", "fieldset", 1);
      token.attrs = [["class", "bbcode-fieldset"]];
      buffer.push(token);

      token = new state.Token("legend_open", "legend", 1);
      token.block = false;
      buffer.push(token);

      token = new state.Token("text", "", 0);
      token.content = title;
      buffer.push(token);

      token = new state.Token("legend_close", "legend", -1);
      buffer.push(token);
      token = new state.Token("span_open", "span", 1);
      token.block = false;
      buffer.push(token);
    },
  });
  TEXT_RULER.push("fieldset_close", {
    matcher: /(\[\/fieldset\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("span_close", "span", -1);
      buffer.push(token);
      token = new state.Token("fieldset_close", "fieldset", -1);
      buffer.push(token);
    },
  });
}

export function setup(helper) {
  helper.allowList(["fieldset.bbcode-fieldset", "legend"]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
