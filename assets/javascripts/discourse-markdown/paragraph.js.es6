/**
 * @file Overrides Discourse's paragraph ruler
 *
 * based on discourses's own custom paragraph ruler:
 * https://github.com/discourse/discourse/blob/master/app/assets/javascripts/pretty-text/engines/discourse-markdown/paragraph.js
 *
 * The goal is to remove the troublesome paragraph tags and implement only linebreaks.
 * This will make rendering easy and not need for as much error handling with orphaned paragraph tags
 */

// based on discourses's own custom paragraph ruler
//
// we use a custom paragraph rule cause we have to signal when a
// link starts with a space, so we can bypass a onebox
// this is a freedom patch, so careful, may break on updates
function paragraph(state, startLine /*, endLine*/) {
  let content,
    terminate,
    i,
    l,
    token,
    oldParentType,
    nextLine = startLine + 1,
    terminatorRules = state.md.block.ruler.getRules("paragraph"),
    endLine = state.lineMax,
    hasLeadingSpace = false;

  oldParentType = state.parentType;
  state.parentType = "paragraph";

  // jump line-by-line until empty one or EOF
  // RPN CUSTOM
  // allows empty line breaks to be rendered
  for (; nextLine < endLine /** && !state.isEmpty(nextLine) */; nextLine++) {
    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) {
      continue;
    }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) {
      continue;
    }

    // Some tags can terminate paragraph without empty line.
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) {
      break;
    }
  }

  // START CUSTOM CODE
  content = state.getLines(startLine, nextLine, state.blkIndent, false);

  i = 0;
  let contentLength = content.length;
  while (i < contentLength) {
    let chr = content.charCodeAt(i);
    if (chr === 0x0a) {
      hasLeadingSpace = false;
    } else if (isWhiteSpace(chr)) {
      hasLeadingSpace = true;
    } else {
      break;
    }
    i++;
  }

  // content = content.trim();
  // END CUSTOM CODE

  state.line = nextLine;

  // RPN CUSTOM
  // we keep this nonexistent token to keep the original
  // purpose of passing metadata down to the link ruler.
  // The renderer will naturally remove it.
  token = state.push("paragraph_open", "p", 1);
  // token.hidden = true;
  token.map = [startLine, state.line];
  // CUSTOM
  token.leading_space = hasLeadingSpace;

  token = state.push("inline", "", 0);
  token.content = content;
  token.map = [startLine, state.line];
  token.children = [];
  // CUSTOM
  token.leading_space = hasLeadingSpace;

  state.push("paragraph_close", "p", -1); // RPN CUSTOM

  state.parentType = oldParentType;
  return true;
}

// Since we override the md.utils.isWhiteSpace to constantly return true for TEXT_RULERS
function isWhiteSpace(code) {
  if (code >= 0x2000 && code <= 0x200a) {
    return true;
  }
  switch (code) {
    case 0x09: // \t
    case 0x0a: // \n
    case 0x0b: // \v
    case 0x0c: // \f
    case 0x0d: // \r
    case 0x20:
    case 0xa0:
    case 0x1680:
    case 0x202f:
    case 0x205f:
    case 0x3000:
      return true;
  }
  return false;
}

function paragraphOpen() {
  return "";
}

function paragraphClose(tokens, idx, options /*, env */) {
  return options.xhtmlOut ? "<br />\n" : "<br>\n";
}

export function setup(helper) {
  helper.registerPlugin((md) => {
    md.block.ruler.at("paragraph", paragraph);
    md.renderer.rules.paragraph_open = paragraphOpen;
    md.renderer.rules.paragraph_close = paragraphClose;
  });
}
