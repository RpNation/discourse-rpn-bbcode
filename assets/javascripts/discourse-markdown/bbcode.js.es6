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

function getAccordionTabs(tokens, startToken) {

  tokens.forEach(loop);

  function loop(item, index) {
    console.log("Token Level: " + item.level + ", Tag: " + item.tag + ", Type: " + item.type + ", Content: " + item.content);
  }

  /*let i = tokens.length - 1;
  let listItems = [];
  let buffer = [];

  for(; tokens[i] !== startToken; i--) {
    if (i === 0) {
      return;
    }
  }

  let token = tokens[i];
  if(token.level === 0) {
    if(token.tag !== "accordion") {
      return;
    }
  }

  if(token.level === 1 && token.nesting === 1) {
    if(token.tag === "acc") {
      listItems.push([token, buffer.reverse().join(" ")]);
    } else {
      return;
    }
  }

  if(token.level === 1 && token.nesting === 1 && token.tag === "acc") {
    buffer = [];
  } else {
    if(token.type === "text" || token.type === "inline") {
      buffer.push(token.content);
    }
  }

  return listItems.reverse();*/
}

function invalidAccordion(state, tag) {
  let token = state.push("text", "", 0);
  token.content = "[/" + tag + "]";
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

    before: function(state, tagInfo, raw) {
      let token = state.push("text", "", 0);
      token.content = raw;
      token.bbcode_attrs = tagInfo.attrs;
      token.bbcode_type = "accordion_open";
    },

    after: function(state, openToken, raw) {
      let rows = getAccordionTabs(state.tokens, openToken);
      if(!rows) {
        return invalidAccordion(state, raw);
      }

      const attrs = openToken.bbcode_attrs;
      const attributes = [["class", "accordion"]];

      let header = [];

      let token = new state.Token("accordion_open", "div", 1);
      token.block = true;
      token.attrs = attributes;
      header.push(token);

      token = new state.Token("description_list_open", "dl", 1);
      header.push(token);

      for(let o = 0; o < rows.length; o++) {
        token = new state.Token("description_title_open", "dt", 1);
        rows.push([token, String(o)]);
        header.push(token);

        token = new state.Token("text", "", 0);
        token.content = String(o);
        header.push(token);

        token = new state.Token("description_title_close", "dt", -1);
        header.push(token);
      }

      token = new state.Token("description_list_close", "dl", -1);
      header.push(token);

      token = state.push("accordion_close", "div", -1);
    }
  }

  md.block.bbcode.ruler.push("accordion", accordionRule);
}

export function setup(helper) {

  helper.whiteList([
    "table[bbcode-table]",
    "table[table-style-*]",
    "div.accordion",
    "dl",
    "dt",
    "span.tr",
    "span.td"]);

  if(helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
    return;
  }
}
