import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["rpn-bbcode"] = true)
);

function wrap(tag, attr, callback) {
  return function(startToken, finishToken, tagInfo) {
    startToken.tag = finishToken.tag = tag;
    startToken.content = finishToken.content = "";

    startToken.type = "bbcode_open";
    finishToken.type = "bbcode_close";

    startToken.nesting = 1;
    finishToken.nesting = -1;

    startToken.attrs = [
      [attr, callback ? callback(tagInfo) : tagInfo.attrs._default]
    ];
  };
}

function setupMarkdownIt(md) {
  const ruler = md.inline.bbcode.ruler;

  md.block.bbcode.ruler.push("table", {
    tag: "table",
    wrap: function(token, tagInfo) {
      token.attrs = [['class', "bbcode-table table-style-" + tagInfo.attrs['_default']]];
      return true;
    }
  });

  ruler.push("tr", {
    tag: "tr",
    wrap: "span.tr"
  });

  ruler.push("td", {
    tag: "td",
    wrap: "span.td"
  });
}

export function setup(helper) {

  helper.whiteList([
    "table.bbcode-table",
    "table.table-style-*",
    "span.tr",
    "span.td"]);

  if(helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
    return;
  }
}
