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
    wrap: "table"
  });
}

export function setup(helper) {

  helper.whitelist("table");

  if(helper.markdownIt) {
    helper.registerPlugin(setupMarkdownIt);
    return;
  }

  const builders = requirejs("pretty-text/engines/discourse-markdown/bbcode")
    .builders;

  const {
    register,
    replaceBBCode,
    rawBBCode,
    replaceBBCodeParamsRaw
  } = builders(helper);
}
