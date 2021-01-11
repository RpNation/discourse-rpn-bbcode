/**
 * @file Adds [row] and [column] to bbcode
 * @example [row][column=span3]content[/column][/row]
 */
import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["row-column"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  const BLOCK_RULER = md.block.bbcode.ruler;

  BLOCK_RULER.push("column", {
    tag: "column",
    before: function (state, tagInfo) {
      let columnOption = tagInfo.attrs["_default"].toLowerCase();
      let token = state.push("div_open", "div", 1);
      if (columnOption.startsWith("span")) {
        token.attrs = [["class", "bbcode-column column-width-" + columnOption]];
      } else {
        token.attrs = [["class", "bbcode-column column-width-span" + columnOption]];
      }
    },
    after: function (state) {
      state.push("div_close", "div", -1);
    },
  });

  BLOCK_RULER.push("row", {
    tag: "row",
    wrap: "div.bbcode-row",
  });
}

export function setup(helper) {
  helper.allowList(["div.bbcode-row"]);
  helper.allowList({
    custom(tag, name, value) {
      if (tag === "div" && name === "class") {
        return /^(bbcode-column column-width-span[1-8])$/.exec(value);
      }
    },
  });
  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
  }
}
