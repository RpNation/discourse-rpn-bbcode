/**
 * @file Adds [justify] to bbcode
 * @example [justify]content[/justify]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption((siteSettings, opts) => (opts.features[""] = !!siteSettings.rpn_bbcode_enabled));

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("justify", {
    tag: "justify",
    wrap: "div.bbcode-justify",
  });
}

export function setup(helper) {
  helper.allowList(["div.bbcode-justify"]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
