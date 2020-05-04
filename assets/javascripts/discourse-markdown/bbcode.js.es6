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

  ruler.push("border", {
    tag: "border",
    wrap: function(startToken, endToken, tagInfo, content) {
      let styleOption = tagInfo.attrs['_default'];

      startToken.type = "div_open";
      startToken.tag = "div";
      startToken.attrs = [["class", "bbcode-border"], ["style", "border: " + styleOption]];
      startToken.content = content;
      startToken.nesting = 1;

      endToken.type = "div_close";
      endToken.tag = "div";
      endToken.content = '';
      endToken.nesting = -1;
    }
  });

  ruler.push("bg", {
    tag: "bg",
    wrap: function(startToken, endToken, tagInfo, content) {
      let bgOption = tagInfo.attrs['_default'];

      startToken.type = "div_open";
      startToken.tag = "div";
      startToken.attrs = [["class", "bbcode-background"], ["style", "background-color: " + bgOption]];
      startToken.content = content;
      startToken.nesting = 1;

      endToken.type = "div_close";
      endToken.tag = "div";
      endToken.content = '';
      endToken.nesting = -1;
    }
  });

  md.block.bbcode.ruler.push("accordion", accordionRule);
}

export function setup(helper) {

  helper.whiteList([
    "div.bbcode-accordion",
    "div.bbcode-border",
    "span.float-right",
    "span.float-left",
    "span.float-center"
  ]);

  helper.whiteList({
    custom(tag, name, value) {
      if(tag === "div" && name === "style") {
        return /^(border:(.*))$/.exec(value);
      }
    }
  });

  helper.whiteList({
    custom(tag, name, value) {
      if(tag === "div" && name === "style") {
        return /^(background\-color:(.*))$/.exec(value);
      }
    }
  })

  if(helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
    return;
  }
}
