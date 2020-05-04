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

  const accordionRule = {
    tag: "accordion",

    before: function(state, tagInfo) {
      const attrs = tagInfo.attrs;

      let token = state.push('div_open', 'div', 1);
      token.attrs = [["class", "bbcode-accordion"]];
    },

    after: function(state, openToken, raw) {
      state.push('div_close', 'div', -1);
    }
  }

  ruler.push("imagefloat", {
    tag: "imagefloat",
    wrap: function(startToken, endToken, tagInfo, content) {
      let floatType = tagInfo.attrs['_default'];

      startToken.type = "span_open";
      startToken.tag = "span";
      startToken.attrs = [["class", "float-" + floatType]];
      startToken.content = content;
      startToken.nesting = 1;

      endToken.type = "span_close";
      endToken.tag = "span";
      endToken.content = '';
      endToken.nesting = -1;
    }
  });

  md.block.bbcode.ruler.push("accordion", accordionRule);
}

export function setup(helper) {

  helper.whiteList([
    "table[bbcode-table]",
    "table[table-style-*]",
    "div.bbcode-accordion",
    "dl",
    "dt",
    "imagefloat",
    "span.tr",
    "span.td",
    "span[float-*]",
    "span.float-right",
    "span.float-left",
    "span.float-center"
  ]);

  if(helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
    return;
  }
}
