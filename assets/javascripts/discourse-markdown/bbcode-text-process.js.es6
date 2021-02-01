/**
 * @file Setup for parsing bbcode
 *
 * based on https://github.com/discourse/discourse/blob/master/app/assets/javascripts/pretty-text/engines/discourse-markdown/text-post-process.js
 *
 * This will create a new ruler that does not have the requirements of text replacement containing whitespace boundaries.
 */

const BBCODE_TAG = /\[(.*)\]/;

function BBCodeTextProcess(content, state, ruler) {
  let result = null;
  let match;
  let pos = 0;

  const matcher = ruler.getMatcher();

  while ((match = matcher.exec(content))) {
    // something is wrong
    if (match.index < pos) {
      break;
    }

    // if match isn't a bbcode tag, skip. Let prev error handler break out of while loop for us.
    if (!match[0].match(BBCODE_TAG)) {
      continue;
    }

    result = result || [];

    if (match.index > pos) {
      let token = new state.Token("text", "", 0);
      token.content = content.slice(pos, match.index);
      result.push(token);
    }

    ruler.applyRule(result, match, state);

    pos = match.index + match[0].length;
  }

  if (result && pos < content.length) {
    let token = new state.Token("text", "", 0);
    token.content = content.slice(pos);
    result.push(token);
  }

  return result;
}

export function setup(helper) {
  helper.registerPlugin((md) => {
    const ruler = md.core.textPostProcess.ruler;
    const replacer = (content, state) => BBCodeTextProcess(content, state, ruler);
    md.core.ruler.push("bbcode", (state) =>
      md.options.discourse.helpers.textReplace(state, replacer, true)
    );
  });
}
