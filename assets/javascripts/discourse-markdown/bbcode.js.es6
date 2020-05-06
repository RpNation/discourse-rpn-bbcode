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

  md.block.bbcode.ruler.push("fieldset", {
    tag: "fieldset",
    before: function(state, tagInfo) {
      let token = state.push("fieldset_open", "fieldset", 1);
      token.attrs = [["class", "bbcode-fieldset"]];

      token = state.push("legend_open", "legend", 1);
      token.block = false;

      token = state.push("text", "", 0);
      token.content = tagInfo.attrs['_default']

      token = state.push("legend_close", "legend", -1);

      token = state.push("span_open", "span", 1);
      token.block = false;
    },
    after: function(state) {
      state.push("span_close", "span", -1);
      state.push("fieldset_close", "fieldset", -1);
    }
  });

  ruler.push("side", {
    tag: "side",
    wrap: function(startToken, endToken, tagInfo, content) {
      let sideOption = tagInfo.attrs['_default'];

      startToken.type = "div_open";
      startToken.tag = "div";
      startToken.attrs = [["class", "bbcode-side-" + sideOption]];
      startToken.content = content;
      startToken.nesting = 1;

      endToken.type = "div_close";
      endToken.tag = "div";
      endToken.content = '';
      endToken.nesting = -1;
    }
  });

  md.block.bbcode.ruler.push("scroll", {
    tag: "scroll",
    wrap: function(token, tagInfo) {
      let heightOption = tagInfo.attrs['_default'];
      token.attrs = [["style", "max-width: 100%; padding: 5px; overflow:auto; border: 1px solid; height:" + heightOption + ";"]];
      return true;
    }
  });

  md.block.bbcode.ruler.push("nobr", {
    tag: "nobr",
    wrap: function(token, tagInfo) {
      let text = token.content;

      text = text.replace(/(\r\n|\n|\r)/gm," ");
      token.content = text;
      return true;
    }
  });

  ruler.push("divide", {
    tag: "divide",
    wrap: function(startToken, endToken, tagInfo, content) {
      let divideOption = tagInfo.attrs['_default'];

      startToken.type = "span_open";
      startToken.tag = "span";
      startToken.attrs = [["class", "bbcode-horizontal-rule-" + divideOption]];
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
    "div.bbcode-accordion",
    "div.bbcode-border",
    "div.bbcode-background",
    "div.bbcode-side-left",
    "div.bbcode-side-right",
    "span.float-right",
    "span.float-left",
    "span.float-center",
    "span.bbcode-horizontal-rule-thick",
    "span.bbcode-horizontal-rule-dotted",
    "span.bbcode-horizontal-rule-dotted-thick",
    "fieldset.bbcode-fieldset",
    "legend"
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
  });

  helper.whiteList({
    custom(tag, name, value) {
      if(tag === "div" && name === "style") {
        return /^(max-width: 100%; padding: 5px; overflow:auto; border: 1px solid; height:[0-9]*px;)$/.exec(value);
      }
    }
  });

  if(helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
    return;
  }
}
