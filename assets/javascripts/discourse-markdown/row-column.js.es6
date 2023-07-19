/**
 * @file Adds [row] and [column] to bbcode
 * @example [row][column=span3]content[/column][/row]
 */
import { registerOption } from "pretty-text/pretty-text";
import { parseBBCodeTag } from "pretty-text/engines/discourse-markdown/bbcode-block";

registerOption(
  (siteSettings, opts) => (opts.features["row-column"] = !!siteSettings.rpn_bbcode_enabled)
);

function setupMarkdownIt(md) {
  // const BLOCK_RULER = md.block.bbcode.ruler;
  const TEXT_RULER = md.core.textPostProcess.ruler;

  // BLOCK_RULER.push("column", {
  //   tag: "column",
  //   before: function (state, tagInfo) {
  //     let columnOption = tagInfo.attrs["_default"].toLowerCase();
  //     let token = state.push("div_open", "div", 1);
  //     if (columnOption.startsWith("span")) {
  //       token.attrs = [["class", "bbcode-column column-width-" + columnOption]];
  //     } else {
  //       token.attrs = [["class", "bbcode-column column-width-span" + columnOption]];
  //     }
  //   },
  //   after: function (state) {
  //     state.push("div_close", "div", -1);
  //   },
  // });

  TEXT_RULER.push("column_open", {
    matcher: /(\[column=((span)?[1-8])\])/gi,
    onMatch: function (buffer, matches, state) {
      const tagInfo = parseBBCodeTag(matches[0], 0, matches[0].length);
      const columnOption = tagInfo.attrs["_default"].toLowerCase();
      let token = new state.Token("div_open", "div", 1);
      if (columnOption.startsWith("span")) {
        token.attrs = [["class", "bbcode-column column-width-" + columnOption]];
      } else {
        token.attrs = [["class", "bbcode-column column-width-span" + columnOption]];
      }
      buffer.push(token);
    },
  });
  TEXT_RULER.push("column_close", {
    matcher: /(\[\/column\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_close", "div", -1);
      buffer.push(token);
    },
  });

  // BLOCK_RULER.push("row", {
  //   tag: "row",
  //   wrap: "div.bbcode-row",
  // });

  TEXT_RULER.push("row_open", {
    matcher: /(\[row\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_open", "div", 1);
      token.attrs = [["class", "bbcode-row"]];
      buffer.push(token);
    },
  });
  TEXT_RULER.push("row_close", {
    matcher: /(\[\/row\])/gi,
    onMatch: function (buffer, matches, state) {
      let token = new state.Token("div_close", "div", -1);
      buffer.push(token);
    },
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
