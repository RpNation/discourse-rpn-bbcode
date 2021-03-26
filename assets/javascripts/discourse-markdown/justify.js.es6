/**
 * @file Adds [justify] to bbcode
 * @example [justify]content[/justify]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption((siteSettings, opts) => (opts.features[""] = !!siteSettings.rpn_bbcode_enabled));

function setupMarkdownIt(md) {
  // const BLOCK_RULER = md.block.bbcode.ruler;
  const TEXT_RULER = md.core.textPostProcess.ruler;

  // BLOCK_RULER.push("justify", {
  //   tag: "justify",
  //   wrap: "div.bbcode-justify",
  // });
  TEXT_RULER.push("justify_open", {
    matcher: /(\[justify\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_open", "div", 1);
      token.attrs = [["class", "bbcode-justify"]];
      buffer.push(token);
    },
  });
  TEXT_RULER.push("justify_close", {
    matcher: /(\[\/justify\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_close", "div", -1);
      buffer.push(token);
    },
  });
}

export function setup(helper) {
  helper.allowList(["div.bbcode-justify"]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
