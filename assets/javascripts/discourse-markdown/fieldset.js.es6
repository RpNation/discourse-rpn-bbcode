/**
 * @file Adds [fieldset] to bbcode
 * @example [fieldset=title]content[/fieldset]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["fieldset"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("fieldset", {
    tag: "fieldset",
    before: function (state, tagInfo) {
      let token = state.push("fieldset_open", "fieldset", 1);
      token.attrs = [["class", "bbcode-fieldset"]];

      token = state.push("legend_open", "legend", 1);
      token.block = false;

      token = state.push("text", "", 0);
      token.content = tagInfo.attrs["_default"];

      token = state.push("legend_close", "legend", -1);

      token = state.push("span_open", "span", 1);
      token.block = false;
    },
    after: function (state) {
      state.push("span_close", "span", -1);
      state.push("fieldset_close", "fieldset", -1);
    },
  });
}

export function setup(helper) {
  helper.allowList(["fieldset.bbcode-fieldset", "legend"]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
