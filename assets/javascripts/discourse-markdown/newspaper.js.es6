/**
 * @file Adds [newspaper] to bbcode
 * @example [newspaper]content[/newspaper]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["newspaper"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  // const INLINE_RULER = md.inline.bbcode.ruler;
  // const BLOCK_RULER = md.block.bbcode.ruler;
  const TEXT_RULER = md.core.textPostProcess.ruler;

  // INLINE_RULER.push("newspaper", {
  //   tag: "newspaper",
  //   wrap: "div.bbcode-newspaper",
  // });

  // BLOCK_RULER.push("newspaper", {
  //   tag: "newspaper",
  //   wrap: "div.bbcode-newspaper",
  // });

  TEXT_RULER.push("newspaper_open", {
    matcher: /(\[newspaper\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_open", "div", 1);
      token.attrs = [["class", "bbcode-newspaper"]];
      buffer.push(token);
    },
  });
  TEXT_RULER.push("newspaper_close", {
    matcher: /(\[\/newspaper\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_close", "div", -1);
      buffer.push(token);
    },
  });
}

export function setup(helper) {
  helper.allowList(["div.bbcode-newspaper"]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
