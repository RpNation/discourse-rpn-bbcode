/**
 * @file Adds [nobr] and [br] to bbcode
 * @example [nobr]content[/nobr]
 *
 * just let the initializer handle it. It's too much trouble to try to do it with the markdown engine
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption((siteSettings, opts) => (opts.features["nobr"] = !!siteSettings.rpn_bbcode_enabled));

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;
  const INLINE_RULER = md.inline.bbcode.ruler;

  BLOCK_RULER.push("nobr", {
    tag: "nobr",
    before: function (state) {
      let token = state.push("nobr", "div", 1);
      token.attrs = [["data-bbcode-nobr", "true"]];
    },
    after: function (state) {
      state.push("nobr", "div", -1);
    },
  });

  INLINE_RULER.push("br", {
    tag: "br",
    replace: function (state) {
      let token = state.push("br", "br", 0);
      token.attrs = [["data-bbcode-nobr-ignore", "true"]]; //so that the nobr initializer doesn't pick it up
      return true;
    },
  });
}

export function setup(helper) {
  helper.allowList(["br[data-bbcode-nobr-ignore]"]);
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
