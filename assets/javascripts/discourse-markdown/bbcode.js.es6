import { registerOption } from "pretty-text/pretty-text";

registerOption(
  (siteSettings, opts) => (opts.features["rpn-bbcode"] = true)
);

function wrap(tag, attr, callback) {
  return function (startToken, finishToken, tagInfo) {
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

  ruler.push("imagefloat", {
    tag: "imagefloat",
    wrap: function (startToken, endToken, tagInfo, content) {
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

  ruler.push("highlight", {
    tag: "highlight",
    wrap: "span.bbcodeHighlight"
  });

  ruler.push("border", {
    tag: "border",
    wrap: function (startToken, endToken, tagInfo, content) {
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
    wrap: function (startToken, endToken, tagInfo, content) {
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
    before: function (state, tagInfo) {
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
    after: function (state) {
      state.push("span_close", "span", -1);
      state.push("fieldset_close", "fieldset", -1);
    }
  });

  ruler.push("side", {
    tag: "side",
    wrap: function (startToken, endToken, tagInfo, content) {
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
    wrap: function (token, tagInfo) {
      let heightOption = tagInfo.attrs['_default'];
      token.attrs = [["style", "max-width: 100%; padding: 5px; overflow:auto; border: 1px solid; height:" + heightOption + ";"]];
      return true;
    }
  });

  md.block.bbcode.ruler.push("nobr", {
    tag: "nobr",
    wrap: function (token, tagInfo) {
      let text = token.content;

      text = text.replace(/(\r\n|\n|\r)/gm, " ");
      token.content = text;
      return true;
    }
  });

  ruler.push("divide", {
    tag: "divide",
    wrap: function (startToken, endToken, tagInfo, content) {
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

  ruler.push("column", {
    tag: "column",
    wrap: function (startToken, endToken, tagInfo, content) {
      let columnOption = tagInfo.attrs['_default'];

      startToken.type = "div_open";
      startToken.tag = "div";
      startToken.attrs = [["class", "column-width-" + columnOption]];
      startToken.content = content;
      startToken.nesting = 1;

      endToken.type = "div_close";
      endToken.tag = "div";
      endToken.content = '';
      endToken.nesting = -1;
    }
  });

  ruler.push("inlinespoiler", {
    tag: "inlinespoiler",
    wrap: function (startToken, endToken, tagInfo, content) {
      startToken.type = "span_open";
      startToken.tag = "span";
      startToken.attrs = [["class", "inlineSpoiler"]];
      startToken.content = content;
      startToken.nesting = 1;

      endToken.type = "span_close";
      endToken.tag = "span";
      endToken.content = '';
      endToken.nesting = -1;
    }
  });

  ruler.push("justify", {
    tag: "justify",
    wrap: function (startToken, endToken, tagInfo, content) {
      startToken.type = "span_open";
      startToken.tag = "span";
      startToken.attrs = [["class", "bbcode-justify"]];
      startToken.content = content;
      startToken.nesting = 1;

      endToken.type = "span_close";
      endToken.tag = "span";
      endToken.content = '';
      endToken.nesting = -1;
    }
  });

  md.block.bbcode.ruler.push("blockquote", {
    tag: "blockquote",
    replace: function (state, tagInfo, content) {
      let author = tagInfo.attrs['_default'];

      let token = state.push("table_open", "table", 1);
      token.attrs = [["class", "bbcode-blockquote"]];

      state.push("tr_open", "tr", 1);

      token = state.push("td_open", "td", 1);
      token.attrs = [["class", "bbcode-blockquote-left"]];

      state.push("td_close", "td", -1);

      token = state.push("td_open", "td", 1);
      token.attrs = [["class", "bbcode-blockquote-content"]];

      token = state.push("inline", "", 0);
      token.content = content;
      token.children = [];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-blockquote-speaker"]];

      token = state.push("text", "", 0);
      token.content = author;

      state.push("div_close", "div", -1);

      state.push("td_close", "td", -1);

      token = state.push("td_open", "td", 1);
      token.attrs = [["class", "bbcode-blockquote-right"]];

      state.push("td_close", "td", -1);

      state.push("tr_close", "tr", -1);

      state.push("table_close", "table", -1);

      return true;
    }
  });

  ruler.push("pindent", {
    tag: "pindent",
    wrap: function (startToken, endToken, tagInfo, content) {
      startToken.type = "span_open";
      startToken.tag = "span";
      startToken.attrs = [["style", "display: inline-block; text-indent:2.5em"]];
      startToken.content = content;
      startToken.nesting = 1;

      endToken.type = "span_close";
      endToken.tag = "span";
      endToken.content = '';
      endToken.nesting = -1;
    }
  });

  md.block.bbcode.ruler.push("print", {
    tag: "print",
    replace: function (state, tagInfo, content) {
      let printOption = tagInfo.attrs['_default'];

      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-print-" + printOption]];

      token = state.push("text", "", 0);
      token.content = content;

      state.push("div_close", "div", -1);

      return true;
    }
  });

  md.block.bbcode.ruler.push("textmessage", {
    tag: "textmessage",
    replace: function (state, tagInfo, content) {
      let textOption = tagInfo.attrs['_default'];

      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-textmessage"]];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-textmessage-name"]];

      token = state.push("text", "", 0);
      token.content = textOption;

      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-textmessage-overflow"]];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-textmessage-content"]];

      token = state.push("text", "", 0);
      token.content = content;

      state.push("div_close", "div", -1);

      state.push("div_close", "div", -1);

      state.push("div_close", "div", -1);

      return true;
    }
  });

  md.block.bbcode.ruler.push("font", {
    tag: "font",
    replace: function (state, tagInfo, content) {
      const base_fonts = [
        "arial",
        "book antiqua",
        "courier new",
        "georgia",
        "tahoma",
        "times new roman",
        "trebuchet ms",
        "verdana",
      ];

      let fontFamily = tagInfo.attrs['_default'].trim();
      let token;
      if (!base_fonts.includes(fontFamily.toLowerCase())) {
        // TODO: Is there a way to do this better so it isn't in-line in the middle of the html?
        token = state.push("script_open", "script", 1);
        token.attrs = [["type", "text/javascript"]]
        token = state.push("text", "", 0);
        token.content = `importFont(${fontFamily})`;
        state.push("script_close", "script", -1);
      }

      token = state.push("div_open", "div", 1);
      token.attrs = [["style", `font-family:${fontFamily}`]];
      token = state.push("text", "", 0);
      token.content = content;
      state.push("div_close", "div", -1);
      return true;
    }
  });

  md.block.bbcode.ruler.push("block", {
    tag: "block",
    replace: function (state, tagInfo, content) {
      let blockOption = tagInfo.attrs['_default'];

      let token = state.push("table_open", "table", 1);
      token.attrs = [["class", "bbcode-block-" + blockOption]];

      state.push("tr_open", "tr", 1);

      token = state.push("td_open", "td", 1);
      token.attrs = [["class", "bbcode-block-icon"]];

      state.push("td_close", "td", -1);

      token = state.push("td_open", "td", 1);
      token.attrs = [["class", "bbcode-block-content"]];

      token = state.push("text", "", 0);
      token.content = content;

      state.push("td_close", "td", -1);

      state.push("tr_close", "tr", -1);

      state.push("table_close", "table", -1);

      return true;
    }
  });

  md.block.bbcode.ruler.push("progress", {
    tag: "progress",
    replace: function (state, tagInfo, content) {
      let progressOption = tagInfo.attrs['_default'];

      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-progress"]];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-progress-text"]];

      token = state.push("text", "", 0);
      token.content = content;

      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-progress-bar"], ["style", "width: calc(" + progressOption + "% - 6px);"]];

      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-progress-bar-other"]];

      state.push("div_close", "div", -1);

      state.push("div_close", "div", -1);

      return true;
    }
  });

  md.block.bbcode.ruler.push("note", {
    tag: "note",
    replace: function (state, tagInfo, content) {

      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-note"]];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-note-tape"]];

      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-note-content"]];

      token = state.push("text", "", 0);
      token.content = content;

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-note-footer"]];

      state.push("div_close", "div", -1);

      state.push("div_close", "div", -1);

      state.push("div_close", "div", -1);

      return true;
    }
  });

  md.block.bbcode.ruler.push("mail", {
    tag: "mail",
    replace: function (state, tagInfo, content) {
      let mailOption = tagInfo.attrs['_default'];

      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-" + mailOption]];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-top-send"]];

      token = state.push("text", "", 0);
      token.content = "Send New Email";

      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-top-receive"]];

      token = state.push("text", "", 0);
      token.content = "New Email Received";

      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-first-row"]];

      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-second-row"]];

      state.push("div_close", "div", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-main"]];

      token = state.push("inline", "", 0);
      token.content = content;
      token.children = [];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-footer"]];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-email-button"]];

      state.push("div_close", "div", -1);

      state.push("div_close", "div", -1);

      state.push("div_close", "div", -1);

      return true;
    }
  });

  ruler.push("person", {
    tag: "person",
    wrap: function (startToken, endToken, tagInfo, content) {
      startToken.type = "div_open";
      startToken.tag = "div";
      startToken.attrs = [["class", "bbcode-email-person"]];
      startToken.content = content;
      startToken.nesting = 1;

      endToken.type = "div_close";
      endToken.tag = "div";
      endToken.content = '';
      endToken.nesting = -1;
    }
  });

  ruler.push("subject", {
    tag: "subject",
    wrap: function (startToken, endToken, tagInfo, content) {
      startToken.type = "div_open";
      startToken.tag = "div";
      startToken.attrs = [["class", "bbcode-email-subject"]];
      startToken.content = content;
      startToken.nesting = 1;

      endToken.type = "div_close";
      endToken.tag = "div";
      endToken.content = '';
      endToken.nesting = -1;
    }
  });

  ruler.push("newspaper", {
    tag: "newspaper",
    wrap: function (startToken, endToken, tagInfo, content) {
      startToken.type = "div_open";
      startToken.tag = "div";
      startToken.attrs = [["class", "bbcode-newspaper"]];
      startToken.content = content;
      startToken.nesting = 1;

      endToken.type = "div_close";
      endToken.tag = "div";
      endToken.content = '';
      endToken.nesting = -1;
    }
  });

  ruler.push("check", {
    tag: "check",
    wrap: function (startToken, endToken, tagInfo, content) {
      let checkOption = tagInfo.attrs['_default'];

      startToken.type = "div_open";
      startToken.tag = "div";
      startToken.attrs = [["class", "bbcode-check-" + checkOption]];
      startToken.content = content;
      startToken.nesting = 1;

      endToken.type = "div_close";
      endToken.tag = "div";
      endToken.content = '';
      endToken.nesting = -1;
    }
  });

  ruler.push("accordion", {
    tag: "accordion",
    wrap: function (startToken, endToken, tagInfo, content) {
      startToken.type = "button_open";
      startToken.tag = "button";
      startToken.attrs = [["class", "accordion"]];
      startToken.content = content;
      startToken.nesting = 1;

      endToken.type = "button_close";
      endToken.tag = "button";
      endToken.content = '';
      endToken.nesting = -1;
    }
  });

  ruler.push("slide", {
    tag: "slide",
    wrap: function (startToken, endToken, tagInfo, content) {
      let slideOption = tagInfo.attrs['_default'];

      startToken.type = "div_open";
      startToken.tag = "div";
      startToken.attrs = [["class", "panel"], ["style", slideOption]];
      startToken.content = content;
      startToken.nesting = 1;

      endToken.type = "div_close";
      endToken.tag = "div";
      endToken.content = '';
      endToken.nesting = -1;
    }
  });

  ruler.push("ooc", {
    tag: "ooc",
    replace: function (state, tagInfo, content) {

      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-ooc"]];

      state.push("div_open", "div", 1);

      token = state.push("text", "", 0);
      token.content = "OOC";

      state.push("div_close", "div", -1);

      token = state.push("text", "", 0);
      token.content = content;

      state.push("div_close", "div", -1);

      return true;
    }
  });

  md.block.bbcode.ruler.push("tabs", {
    tag: "tabs",
    wrap: "div.rpntab"
  });

  md.block.bbcode.ruler.push("tab", {
    tag: "tab",
    replace: function (state, tagInfo, content) {
      let tabTitle = tagInfo.attrs['_default'];

      let token = state.push("button_open", "button", 1);
      token.attrs = [["class", "rpntablinks"], ["onclick", "openRPNTab(event)"]];

      token = state.push("text", "", 0);
      token.content = tabTitle;

      state.push("button_close", "button", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "rpntabcontent"]];

      token = state.push("p_open", "p", 1);

      token = state.push("text", "", 0);
      token.content = content;

      state.push("p_close", "p", -1);

      state.push("div_close", "div", -1);

      return true;
    }
  });
}

export function setup(helper) {

  helper.whiteList([
    "button.accordion",
    "button.rpntablinks",
    "div.bbcode-border",
    "div.bbcode-background",
    "div.bbcode-side-left",
    "div.bbcode-side-right",
    "div.bbcode-blockquote-speaker",
    "div.bbcode-print-top-tear",
    "div.bbcode-print-bottom-tear",
    "div.bbcode-print-line",
    "div.bbcode-print-graph",
    "div.bbcode-print-parchment",
    "div.bbcode-textmessage",
    "div.bbcode-textmessage-name",
    "div.bbcode-textmessage-overflow",
    "div.bbcode-textmessage-content",
    "div.bbcode-progress",
    "div.bbcode-progress-text",
    "div.bbcode-progress-bar",
    "div.bbcode-progress-bar-other",
    "div.bbcode-note",
    "div.bbcode-note-tape",
    "div.bbcode-note-content",
    "div.bbcode-note-footer",
    "div.bbcode-email-send",
    "div.bbcode-email-receive",
    "div.bbcode-email-top-send",
    "div.bbcode-email-top-receive",
    "div.bbcode-email-first-row",
    "div.bbcode-email-second-row",
    "div.bbcode-email-main",
    "div.bbcode-email-footer",
    "div.bbcode-email-button",
    "div.bbcode-email-person",
    "div.bbcode-newspaper",
    "div.bbcode-check-dot",
    "div.bbcode-check-check",
    "div.bbcode-check-cross",
    "div.bbcode-ooc",
    "div.rpntab",
    "div.rpntabcontent",
    "div.slide",
    // TODO: Uncomment to test in-line script running for GFonts. Whitelist ref: https://meta.discourse.org/t/whitelist-all-the-code-inside-of-a-div-tag/51391/4
    //"script",
    "span.float-right",
    "span.float-left",
    "span.float-center",
    "span.bbcode-horizontal-rule-thick",
    "span.bbcode-horizontal-rule-dotted",
    "span.bbcode-horizontal-rule-dotted-thick",
    "span.inlineSpoiler",
    "span.bbcode-justify",
    "span.bbcodeHighlight",
    "fieldset.bbcode-fieldset",
    "legend",
    "table.bbcode-blockquote",
    "table.bbcode-block-dice",
    "td.bbcode-blockquote-left",
    "td.bbcode-blockquote-right",
    "td.bbcode-blockquote-content"
  ]);

  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        return /^(border:(.*))$/.exec(value);
      }
    }
  });

  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        return /^(background\-color:(.*))$/.exec(value);
      }
    }
  });

  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        return /^(max-width: 100%; padding: 5px; overflow:auto; border: 1px solid; height:[0-9]*px;)$/.exec(value);
      }
    }
  });

  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        return /^(width: calc\(([0-9]|[1-9][0-9]|(100))% - 6px\);)$/.exec(value);
      }
    }
  });

  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        return /^font-family:[\w\s]+$/.exec(value);
      }
    }
  });

  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "div" && name === "class") {
        return /^(bbcode-column-width-[1-8])$/.exec(value);
      }
    }
  });

  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "button" && name === "onclick") {
        return /^(openRPNTab\(event\))$/.exec(value);
      }
    }
  });

  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "span" && name === "style") {
        return /^(display: inline-block; text-indent:2\.5em)$/.exec(value);
      }
    }
  });

  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "script") {
        return /^.*$/.exec(value);
      }
    }
  });

  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
    return;
  }
}
