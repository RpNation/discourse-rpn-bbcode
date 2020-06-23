import { registerOption } from "pretty-text/pretty-text";

/*
Image Float.........TAG-001..........WHITElIST-001
Highlight...........TAG-002..........WHITELIST-002
Border..............TAG-003..........WHITELIST-003CR
Background..........TAG-004..........WHITELIST-004CR
Fieldset............TAG-005..........WHITELIST-005
Side................TAG-006..........WHITELIST-006
Scroll..............TAG-007..........WHITELIST-007
NOBR................TAG-008..........No Whitelist Applicable
Divide..............TAG-009..........WHITELIST-009
Row & Column........TAG-010..........WHITELIST-010
Inline Spoiler......TAG-011..........WHITELIST-011
Justify.............TAG-012..........WHITELIST-012
Blockquote..........TAG-013..........WHITELIST-013
Paragraph Indent....TAG-014..........WHITELIST-014
Print...............TAG-015..........WHITELIST-015
Text Message........TAG-016..........WHITELIST-016
Font................TAG-017..........WHITELIST-017CR
Block...............TAG-018..........WHITELIST-018...Whitelists Missing
Progress............TAG-019..........WHITELIST-019CR
Note................TAG-020..........WHITELIST-020
Mail................TAG-021..........WHITELIST-021
Newspaper...........TAG-022..........WHITELIST-022
Check...............TAG-023..........WHITELIST-023
Accordion...........TAG-024..........WHITELIST-024CR
OOC.................TAG-025..........WHITELIST-025
Tabs................TAG-026..........WHITELIST-026CR
Center..............TAG-027..........WHITELIST-027
Left................TAG-028..........WHITELIST-028
Right...............TAG-029..........WHITELIST-029
Color...............TAG-030..........WHITELIST-030R
Size................TAG-031..........WHITELIST-031CR
Spoiler.............TAG-032..........WHITELIST-032CR
Font Awesome........TAG-033..........WHITELIST-033C
Anchor..............TAG-034..........WHITELIST-034CR
*/

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
  const loaded_fonts = [];
  const ruler = md.inline.bbcode.ruler;
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

  /*************************************************
  *** Image Float                         TAG-001***
  *************************************************/

  ruler.push("imagefloat", {
    tag: "imagefloat",
    wrap: wrap(
      "span",
      "class",
      tagInfo => "float-" + tagInfo.attrs._default.trim()
    )
  });

  /*************************************************
  *** Highlight                           TAG-002***
  *************************************************/

  ruler.push("highlight", {
    tag: "highlight",
    wrap: "span.bbcodeHighlight"
  });

  /*************************************************
  *** Border                              TAG-003***
  *************************************************/

  md.block.bbcode.ruler.push("border", {
    tag: "border",
    before: function (state, tagInfo) {
      let styleOption = tagInfo.attrs['_default'];
      let token = state.push('div_open', 'div', 1);
      token.attrs = [["class", "bbcode-border"], ["style", "border: " + styleOption]];
    },
    after: function (state) {
      state.push('div_close', 'div', -1);
    }
  });

  /*************************************************
  *** Background                          TAG-004***
  *************************************************/

  md.block.bbcode.ruler.push("bg", {
    tag: "bg",
    before: function (state, tagInfo) {
      let bgOption = tagInfo.attrs['_default'];
      let token = state.push('div_open', 'div', 1);
      token.attrs = [["class", "bbcode-background"], ["style", "background-color: " + bgOption]];
    },
    after: function (state) {
      state.push('div_close', 'div', -1);
    }
  });

  /*************************************************
  *** Fieldset                            TAG-005***
  *************************************************/

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

  /*************************************************
  *** Side                                TAG-006***
  *************************************************/

  md.block.bbcode.ruler.push("side", {
    tag: "side",
    before: function (state, tagInfo) {
      let sideOption = tagInfo.attrs['_default'];
      let token = state.push('div_open', 'div', 1);
      token.attrs = [["class", "bbcode-side-" + sideOption]];
    },
    after: function (state) {
      state.push('div_close', 'div', -1);
    }
  });

  /*************************************************
  *** Scroll                              TAG-007***
  *************************************************/

  md.block.bbcode.ruler.push("scroll", {
    tag: "scroll",
    wrap: function (token, tagInfo) {
      let heightOption = tagInfo.attrs['_default'];
      token.attrs = [["style", "max-width: 100%; padding: 5px; overflow:auto; border: 1px solid; height:" + heightOption + ";"]];
      return true;
    }
  });

  /*************************************************
  *** NOBR                                TAG-008***
  *************************************************/

  md.block.bbcode.ruler.push("nobr", {
    tag: "nobr",
    wrap: function (token, tagInfo) {
      let text = token.content;

      text = text.replace(/(\r\n|\n|\r)/gm, " ");
      token.content = text;
      return true;
    }
  });

  /*************************************************
  *** Divide                              TAG-009***
  *************************************************/

  ruler.push("divide", {
    tag: "divide",
    wrap: wrap("span", "class", (tagInfo) =>
      !tagInfo.attrs["_default"]
        ? "bbcode-horizontal-rule"
        : "bbcode-horizontal-rule-" + divideOption
    ),
  });

  /*************************************************
  *** Row & Column                        TAG-010***
  *************************************************/

  ruler.push("column", {
    tag: "column",
    wrap: function (startToken, endToken, tagInfo, content) {
      let columnOption = tagInfo.attrs['_default'];

      startToken.type = "div_open";
      startToken.tag = "div";
      columnOption = columnOption.toLowerCase();
      if (columnOption.startsWith('span')) {
        startToken.attrs = [["class", "bbcode-column column-width-" + columnOption]];
      } else {
        startToken.attrs = [["class", "bbcode-column column-width-span" + columnOption]];
      }
      startToken.content = content;
      startToken.nesting = 1;

      endToken.type = "div_close";
      endToken.tag = "div";
      endToken.content = '';
      endToken.nesting = -1;
    }
  });

  ruler.push("row", {
    tag: "row",
    wrap: function (startToken, endToken, tagInfo, content) {

      startToken.type = "div_open";
      startToken.tag = "div";
      startToken.attrs = [["class", "bbcode-row"]];
      startToken.content = content;
      startToken.nesting = 1;

      endToken.type = "div_close";
      endToken.tag = "div";
      endToken.content = '';
      endToken.nesting = -1;
    }
  });

  /*************************************************
  *** Inline Spoiler                      TAG-011***
  *************************************************/

  ruler.push("inlinespoiler", {
    tag: "inlinespoiler",
    wrap: 'span.inlineSpoiler'
  });

  /*************************************************
  *** Justify                             TAG-012***
  *************************************************/

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

  /*************************************************
  *** Blockquote                          TAG-013***
  *************************************************/

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

  /*************************************************
  *** Paragraph Indent                    TAG-014***
  *************************************************/

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

  /*************************************************
  *** Print                               TAG-015***
  *************************************************/

  md.block.bbcode.ruler.push("print", {
    tag: "print",
    replace: function (state, tagInfo, content) {
      let printOption = tagInfo.attrs['_default'];

      let token = state.push("div_open", "div", 1);
      if (!printOption) {
        token.attrs = [["class", "bbcode-print"]];
      } else {
        token.attrs = [["class", "bbcode-print-" + printOption]];
      }

      token = state.push("inline", "", 0);
      token.content = content;
      token.children = [];

      state.push("div_close", "div", -1);

      return true;
    }
  });

  /*************************************************
  *** Text Message                        TAG-016***
  *************************************************/

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

  /*************************************************
  *** Font                                TAG-017***
  *************************************************/

  md.block.bbcode.ruler.push("font", {
    tag: "font",
    replace: function (state, tagInfo, content) {
      const fontFamily = tagInfo.attrs['_default'] || tagInfo.attrs['family'] || tagInfo.attrs['name'];
      const fontColor = tagInfo.attrs['color'];
      const fontSize = tagInfo.attrs['size'];

      let token;
      if (fontFamily && !base_fonts.includes(fontFamily.toLowerCase()) && !loaded_fonts.includes(fontFamily)) {
        addFontLinkTag(token, state, fontFamily);
      }

      token = state.push("div_open", "div", 1);
      token.attrs = generateFontTagAttributes(fontFamily, fontSize, fontColor);
      token = state.push("inline", "", 0);
      token.content = content;
      token.children = [];
      state.push("div_close", "div", -1);
      return true;
    }
  });

  ruler.push("font", {
    tag: "font",
    replace: function (state, tagInfo, content) {
      const fontFamily = tagInfo.attrs['_default'] || tagInfo.attrs['family'] || tagInfo.attrs['name'];
      const fontColor = tagInfo.attrs['color'];
      const fontSize = tagInfo.attrs['size'];

      let token;
      if (fontFamily && !base_fonts.includes(fontFamily.toLowerCase()) && !loaded_fonts.includes(fontFamily)) {
        addFontLinkTag(token, state, fontFamily);
      }

      token = state.push("span_open", "span", 1);
      token.attrs = generateFontTagAttributes(fontFamily, fontSize, fontColor);

      let lineBreakRegex = /\r?\n/gm;
      const splitContent = content.trim().split(lineBreakRegex);
      const contentLength = splitContent.length - 1;

      for (let i = 0; i <= contentLength; ++i) {
        token = state.push("text", "", 0);
        token.content = splitContent[i];

        if (i != contentLength) {
          state.push("br", "br", 0);
        }
      }

      state.push("span_close", "span", -1);
      return true;
    }
  });

  function addFontLinkTag(token, state, fontFamily) {
    token = state.push("link", "link", 0);
    token.attrs = [["rel", "stylesheet"], ["type", "text/css"], ["href", `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s/g, '+')}`]];
    loaded_fonts.push(fontFamily);
  }

  function generateFontTagAttributes(fontFamily, fontSize, fontColor) {
    let fontAttributes = [];
    let styleValue = '';
    if (fontFamily) {
      styleValue += `font-family:${fontFamily},Helvetica,Arial,sans-serif;`;
    }

    if (fontSize) {
      fontSize = parseFontSize(fontSize);
      if (fontSize.valid) {
        if (fontSize.unit) {
          styleValue += `font-size:${fontSize.value}${fontSize.unit};`;
        } else {
          fontAttributes.push(["class", `bbcode-size-${fontSize.value}`]);
        }
      }
    }

    if (fontColor) {
      styleValue += `color:${fontColor};`
    }

    if (styleValue.length) {
      fontAttributes.push(["style", styleValue]);
    }
    return fontAttributes;
  }

  /*************************************************
  *** Block                               TAG-018***
  *************************************************/

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

      token = state.push("inline", "", 0);
      token.content = content;
      token.children = [];

      state.push("td_close", "td", -1);

      state.push("tr_close", "tr", -1);

      state.push("table_close", "table", -1);

      return true;
    }
  });

  /*************************************************
  *** Progress                            TAG-019***
  *************************************************/

  md.block.bbcode.ruler.push("progress", {
    tag: "progress",
    replace: function (state, tagInfo, content) {
      let progressOption = tagInfo.attrs['_default'];

      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-progress"]];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-progress-text"]];

      token = state.push("inline", "", 0);
      token.content = content;
      token.children = [];

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

  /*************************************************
  *** Note                                TAG-020***
  *************************************************/

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

      token = state.push("inline", "", 0);
      token.content = content;
      token.children = [];

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-note-footer"]];

      state.push("div_close", "div", -1);

      state.push("div_close", "div", -1);

      state.push("div_close", "div", -1);

      return true;
    }
  });

  /*************************************************
  *** Mail                                TAG-021***
  *************************************************/

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

  /*************************************************
  *** Newspaper                           TAG-022***
  *************************************************/

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

  /*************************************************
  *** Check                               TAG-023***
  *************************************************/

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

  /*************************************************
  *** Accordion                           TAG-024***
  *************************************************/

  md.block.bbcode.ruler.push("accordion", {
    tag: "accordion",
    wrap: "div.bbcode-accordion"
  });

  md.block.bbcode.ruler.push("slide", {
    tag: "slide",
    before: function (state, tagInfo) {
      let slideTitle = tagInfo.attrs['_default'];
      let token = state.push("button_open", "button", 1);
      token.attrs = [["class", "bbcode-slide-title"], ["onclick", "toggleBBCodeSlide(event)"]];

      token = state.push("text", "", 0);
      token.content = slideTitle;

      state.push("button_close", "button", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-slide-content"]];
    },
    after: function (state) {
      state.push("div_close", "div", -1);
    }
  });

  /*************************************************
  *** OOC                                 TAG-025***
  *************************************************/

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

  /*************************************************
  *** Tabs                                TAG-026***
  *************************************************/

  md.block.bbcode.ruler.push("tabs", {
    tag: "tabs",
    wrap: "div.bbcode-tab"
  });

  md.block.bbcode.ruler.push("tab", {
    tag: "tab",
    before: function (state, tagInfo) {
      let tabTitle = tagInfo.attrs['_default'];

      let token = state.push("button_open", "button", 1);
      token.attrs = [["class", "bbcode-tab-links"], ["onclick", "openBBCodeTab(event)"]];

      token = state.push("text", "", 0);
      token.content = tabTitle;

      state.push("button_close", "button", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-tab-content"]];
    },
    after: function (state) {
      state.push("div_close", "div", -1);
    }
  });

  /*************************************************
  *** Center                                TAG-027***
  *************************************************/

  md.block.bbcode.ruler.push("center", {
    tag: "center",
    replace: function (state, tagInfo, content) {

      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-content-center"]];

      token = state.push("inline", "", 0);
      token.content = content;
      token.children = [];

      state.push("div_close", "div", -1);

      return true;
    }
  });

  /*************************************************
  *** Left                                TAG-028***
  *************************************************/

  md.block.bbcode.ruler.push("left", {
    tag: "left",
    replace: function (state, tagInfo, content) {

      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-content-left"]];

      token = state.push("inline", "", 0);
      token.content = content;
      token.children = [];

      state.push("div_close", "div", -1);

      return true;
    }
  });

  /*************************************************
  *** Right                                TAG-029***
  *************************************************/

  md.block.bbcode.ruler.push("right", {
    tag: "right",
    replace: function (state, tagInfo, content) {

      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-content-right"]];

      token = state.push("inline", "", 0);
      token.content = content;
      token.children = [];

      state.push("div_close", "div", -1);

      return true;
    }
  });

  /*************************************************
  *** Color                                TAG-030***
  *************************************************/

  md.block.bbcode.ruler.push("color", {
    tag: "color",
    before: function (state, tagInfo) {
      let token = state.push("div_open", "div", 1);
      token.attrs = [["style", `color:${tagInfo.attrs['_default']}`]];
    },
    after: function (state) {
      state.push("div_close", "div", -1);
    }
  });

  ruler.push("color", {
    tag: "color",
    before: function (state, tagInfo) {
      let token = state.push("span_open", "span", 1);
      token.attrs = [["style", `color:${tagInfo.attrs['_default']}`]];
    },
    after: function (state) {
      state.push("span_close", "span", -1);
    }
  });

  /*************************************************
   *** Size                                TAG-031***
   *************************************************/

  md.block.bbcode.ruler.push("size", {
    tag: "size",
    before: function (state, tagInfo) {
      const fontSize = parseFontSize(tagInfo.attrs['_default']);
      let token = state.push("div_open", "div", 1);
      if (fontSize.valid) {
        token.attrs = fontSize.unit
          ? [["style", `font-size:${fontSize.value}${fontSize.unit}`]]
          : [["class", `bbcode-size-${fontSize.value}`]];
      }
    },
    after: function (state) {
      state.push("div_close", "div", -1);
    }
  });

  ruler.push("size", {
    tag: "size",
    before: function (state, tagInfo) {
      const fontSize = parseFontSize(tagInfo.attrs['_default']);
      let token = state.push("span_open", "div", 1);
      if (fontSize.valid) {
        token.attrs = fontSize.unit
          ? [["style", `font-size:${fontSize.value}${fontSize.unit}`]]
          : [["class", `bbcode-size-${fontSize.value}`]];
      }
    },
    after: function (state) {
      state.push("span_close", "div", -1);
    }
  });

  function parseFontSize(fontValue) {
    let value;
    let fontSize = { valid: true };
    const parsedSize = /(\d+\.?\d?)(px|rem)?/.exec(fontValue);
    const sizeRanges = {
      px_max: 36,
      px_min: 8,
      rem_max: 3,
      rem_min: 0.2,
      unitless_max: 7,
      unitless_min: 1
    };

    fontSize.unit = parsedSize[2];
    if (value = parsedSize[1]) {
      switch (fontSize.unit) {
        case 'px':
          if (value > sizeRanges.px_max) { value = sizeRanges.px_max; }
          else if (value < sizeRanges.px_min) { value = sizeRanges.px_min; }
          break;
        case 'rem':
          if (value > sizeRanges.rem_max) { value = sizeRanges.rem_max; }
          else if (value < sizeRanges.rem_min) { value = sizeRanges.rem_min; }
          break;
        default:
          if (fontSize.valid = fontValue.length === value.length) {
            if (value > sizeRanges.unitless_max) { value = sizeRanges.unitless_max; }
            else if (value < sizeRanges.unitless_min) { value = sizeRanges.unitless_min; }
          }
          break;
      }

      fontSize.value = value;
    }
    return fontSize;
  }

  /*************************************************
  *** Spoiler                             TAG-032***
  *************************************************/

  md.block.bbcode.ruler.push("spoiler", {
    tag: "spoiler",
    before: function (state, tagInfo) {
      let title = tagInfo.attrs['_default'];
      let token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-spoiler"]];

      token = state.push("button_open", "button", 1);
      token.attrs = [["class", "bbcode-spoiler-button"], ["onclick", "toggleBBCodeSpoiler(event)"]];
      token = state.push("text", "", 0);
      if (!title) {
        token.content = "Spoiler";
      } else {
        token.content = "Spoiler: " + title.trim();
      }
      state.push("button_close", "button", -1);

      token = state.push("div_open", "div", 1);
      token.attrs = [["class", "bbcode-spoiler-content"]];
    },
    after: function (state) {
      state.push("div_close", "div", -1);
      state.push("div_close", "div", -1);
      return true;
    }
  });

  /*************************************************
 *** Font Awesome Icons                   TAG-033***
 *************************************************/

  ruler.push("fa", {
    tag: "fa",
    replace: function (state, tagInfo, content) {
      const tagAttributes = content.split(/\s/);
      if (tagAttributes.length > 1) {
        let iconType = tagAttributes[0].length == 2 ? "far" : tagAttributes[0];
        let iconReference = tagAttributes[1].replace(/fa\w*/, iconType);
        let iconAttributes = handleIconStyles(tagAttributes);
        let token = state.push("svg_open", "svg", 1);
        if (iconAttributes.length) {
          token.attrs = iconAttributes;
        }
        token = state.push("use_open", "use", 1);
        token.attrs = [["href", `#${iconReference}`]];
        token = state.push("use_close", "use", -1);
        token = state.push("svg_close", "svg", -1);
        return true;
      }
    }
  });

  function handleIconStyles(tagAttributes) {
    let currentMatch;
    const duotoneMatch = /(.*)\{(.*)\}/;
    let iconStyles = {
      classes: '',
      styles: ''
    };

    for (let i = 2; i < tagAttributes.length; i++) {
      if (currentMatch = tagAttributes[i].match(duotoneMatch)) {
        iconStyles.styles = `${iconStyles.styles} --${currentMatch[1]}:${currentMatch[2]};`
      } else {
        iconStyles.classes = `${iconStyles.classes} ${tagAttributes[i].trim()}`
      }
    }

    let attributes = [];
    if (iconStyles.styles.length) {
      attributes.push(["style", iconStyles.styles])
    }
    if (iconStyles.classes.length) {
      attributes.push(["class", iconStyles.classes])
    }

    return attributes;
  }

  /*****************************************************
  *** Anchor                                 TAG-034***
  *****************************************************/

  ruler.push("a", {
    tag: "a",
    wrap: wrap(
      "a",
      "id",
      tagInfo => `user-anchor-${tagInfo.attrs._default}`
    )
  });

  ruler.push("goto", {
    tag: "goto",
    wrap: function (startToken, endToken, tagInfo, content) {
      let tagID = tagInfo.attrs['_default'];
      startToken.type = "a_open";
      startToken.tag = 'a';
      token.attrs = [["href", `javascript:;`], ["onclick", `document.location.hash=''; document.location.hash='user-anchor-${tagID}';`]];
      startToken.content = '';
      startToken.nesting = 1;

      endToken.type = 'a_close';
      endToken.tag = 'a';
      endToken.content = '';
      endToken.nesting = -1;
    }
  });
}

export function setup(helper) {

  helper.whiteList([
    /* Image Float                     WHITELIST-001*/
    "span.float-right",
    "span.float-left",
    "span.float-center",
    /* Highlight                       WHITELIST-002*/
    "span.bbcodeHighlight",
    /* Border                          WHITELIST-003C*/
    "div.bbcode-border",
    /* Background                      WHITELIST-004C*/
    "div.bbcode-background",
    /* Fieldset                        WHITELIST-005*/
    "fieldset.bbcode-fieldset",
    "legend",
    /* Side                            WHITELIST-006*/
    "div.bbcode-side-left",
    "div.bbcode-side-right",
    /* Divide                          WHITELIST-009*/
    "span.bbcode-horizontal-rule",
    "span.bbcode-horizontal-rule-thick",
    "span.bbcode-horizontal-rule-dotted",
    "span.bbcode-horizontal-rule-dotted-thick",
    /* Row & Column                      WHITELIST-010*/
    "div.bbcode-row",
    /* Inline Spoiler                  WHITELIST-011*/
    "span.inlineSpoiler",
    /* Justify                         WHITELIST-012*/
    "span.bbcode-justify",
    /* Blockquote                      WHITELIST-013*/
    "table.bbcode-blockquote",
    "td.bbcode-blockquote-left",
    "td.bbcode-blockquote-content",
    "div.bbcode-blockquote-speaker",
    "td.bbcode-blockquote-right",
    /* Print                           WHITELIST-015*/
    "div.bbcode-print-top-tear",
    "div.bbcode-print-bottom-tear",
    "div.bbcode-print",
    "div.bbcode-print-line",
    "div.bbcode-print-graph",
    "div.bbcode-print-parchment",
    /* Text Message                    WHITELIST-016*/
    "div.bbcode-textmessage",
    "div.bbcode-textmessage-name",
    "div.bbcode-textmessage-overflow",
    "div.bbcode-textmessage-content",
    /* Font                            WHITELIST-017C*/
    "link[href=https://fonts.googleapis.com/*]",
    "link[rel=stylesheet]",
    "link[type=text/css]",
    /* Block                           WHITELIST-018*/
    "table.bbcode-block-dice",
    /* Progress                        WHITELIST-019C*/
    "div.bbcode-progress",
    "div.bbcode-progress-text",
    "div.bbcode-progress-bar",
    "div.bbcode-progress-bar-other",
    /* Progress                        WHITELIST-020*/
    "div.bbcode-note",
    "div.bbcode-note-tape",
    "div.bbcode-note-content",
    "div.bbcode-note-footer",
    /* Mail                            WHITELIST-021*/
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
    "div.bbcode-email-subject",
    /* Newspaper                       WHITELIST-022*/
    "div.bbcode-newspaper",
    /* Check                           WHITELIST-023*/
    "div.bbcode-check-dot",
    "div.bbcode-check-check",
    "div.bbcode-check-cross",
    /* Accordion                       WHITELIST-024C*/
    "div.bbcode-accordion",
    "button.bbcode-slide-title",
    "div.bbcode-slide-content",
    /* OOC                             WHITELIST-025*/
    "div.bbcode-ooc",
    /* Tabs                            WHITELIST-026C*/
    "div.bbcode-tab",
    "button.bbcode-tab-links",
    "div.bbcode-tab-content",
    /* Center                          WHITELIST-027*/
    "div.bbcode-content-center",
    /* Left                            WHITELIST-028*/
    "div.bbcode-content-left",
    /* Right                           WHITELIST-029*/
    "div.bbcode-content-right",
    /*Size                             WHITELIST-031C*/
    "div.bbcode-size-1",
    "div.bbcode-size-2",
    "div.bbcode-size-3",
    "div.bbcode-size-4",
    "div.bbcode-size-5",
    "div.bbcode-size-6",
    "div.bbcode-size-7",
    "span.bbcode-size-1",
    "span.bbcode-size-2",
    "span.bbcode-size-3",
    "span.bbcode-size-4",
    "span.bbcode-size-5",
    "span.bbcode-size-6",
    "span.bbcode-size-7",
    /* Spoiler                         WHITELIST-032C*/
    "div.bbcode-spoiler",
    "button.bbcode-spoiler-button",
    "div.bbcode-spoiler-content",
    /* Font Awesome                   WHITELIST-033C*/
    "svg[class=*]",
    "svg[style=*]",
    "use[href=*]",
    /* Anchor                        WHITELIST-034C*/
    "a[href=javascript:;]"
  ]);

  /* Border                            WHITELIST-003R*/
  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        return /^(border:(.*))$/.exec(value);
      }
    }
  });

  /* Background                        WHITELIST-004R*/
  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        return /^(background\-color:(.*))$/.exec(value);
      }
    }
  });

  /* Scroll                            WHITELIST-007*/
  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        return /^(max-width: 100%; padding: 5px; overflow:auto; border: 1px solid; height:[0-9]*px;)$/.exec(value);
      }
    }
  });

  /* Row & Column                      WHITELIST-010*/
  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "div" && name === "class") {
        return /^(bbcode-column column-width-span[1-8])$/.exec(value);
      }
    }
  });

  /* Paragraph Indent                 WHITELIST-014*/
  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "span" && name === "style") {
        return /^(display: inline-block; text-indent:2\.5em)$/.exec(value);
      }
    }
  });

  /* Font                             WHITELIST-017R*/
  helper.whiteList({
    custom(tag, name, value) {
      if ((tag === "div" || tag === "span") && name === "style") {
        return /^(font-family:[\w\s]+,Helvetica,Arial,sans-serif;)?(font-size:(\d+\.?\d?)(px|rem);)?(color:(\w+|#[0-9a-fA-F]{6}|rgb\([0-9]{1,3},\s?[0-9]{1,3},\s?[0-9]{1,3}\)|rgba\([0-9]{1,3},\s?[0-9]{1,3},\s?[0-9]{1,3},\s?(1|0|0\.[0-9]{0,2})\));)?$/.exec(value);
      }
    }
  });

  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "link" && name === "href") {
        return /^https\:\/\/fonts\.googleapis\.com\/css2\?family=(.*)$/.exec(value);
      }
    }
  });

  /* Progress                         WHITELIST-019R*/
  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "div" && name === "style") {
        return /^(width: calc\(([0-9]|[1-9][0-9]|(100))% - 6px\);)$/.exec(value);
      }
    }
  });

  /* Accordion                        WHITELIST-024R*/
  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "button" && name === "onclick") {
        return /^(toggleBBCodeSlide\(event\))$/.exec(value);
      }
    }
  });

  /* Tabs                             WHITELIST-026R*/
  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "button" && name === "onclick") {
        return /^(openBBCodeTab\(event\))$/.exec(value);
      }
    }
  });

  /* Color                             WHITELIST-030R*/
  helper.whiteList({
    custom(tag, name, value) {
      if ((tag === "div" || tag === "span") && name === "style") {
        return /^color:(\w+)$/.exec(value);
      }
    }
  });

  helper.whiteList({
    custom(tag, name, value) {
      if ((tag === "div" || tag === "span") && name === "style") {
        return /^color:\#[0-9a-fA-F]{6}$/.exec(value);
      }
    }
  });

  helper.whiteList({
    custom(tag, name, value) {
      if ((tag === "div" || tag === "span") && name === "style") {
        return /^color:rgb\([0-9]{1,3},\s?[0-9]{1,3},\s?[0-9]{1,3}\)$/.exec(value);
      }
    }
  });

  helper.whiteList({
    custom(tag, name, value) {
      if ((tag === "div" || tag === "span") && name === "style") {
        return /^color:rgba\([0-9]{1,3},\s?[0-9]{1,3},\s?[0-9]{1,3},\s?(1|0|0\.[0-9]{0,2})\)$/.exec(value);
      }
    }
  });

  /* Size                             WHITELIST-031R*/
  helper.whiteList({
    custom(tag, name, value) {
      if ((tag === "div" || tag === "span") && name === "style") {
        return /^font-size:(\d+\.?\d?)(px|rem)$/.exec(value);
      }
    }
  });

  /* Spoiler                          WHITELIST-032R*/
  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "button" && name === "onclick") {
        return /^(toggleBBCodeSpoiler\(event\))$/.exec(value);
      }
    }
  });

  /*Anchor                            WHITELIST-034R*/
  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "a" && name === "onclick") {
        return /^document\.location\.hash=''; document\.location\.hash='user-anchor-\w+';$/.exec(value);
      }
    }
  });

  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "a" && name === "id") {
        return /^user-anchor-\w+$/.exec(value);
      }
    }
  });

  if (helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
    return;
  }
}
