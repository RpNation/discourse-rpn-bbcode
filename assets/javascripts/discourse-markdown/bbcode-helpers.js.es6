/**
 * This callback function is for altering the attribute value given the tagInfo
 *
 * @callback wrapCallback
 * @param {object} tagInfo callback function will feed in the tagInfo object of the tag
 * @returns {string} attrs value
 */
/**
 * A generalized wrap function for simple Wrap method rulers that don't need a full blown function, but could use an arrow function
 * @param {string} tag name of the tag
 * @param {string} attr  the html attribute that the callback function will be applied to
 * @param {wrapCallback} callback Any necessary callback function. Will use tagInfo.attrs._default if not provided
 */
export function wrap(tag, attr, callback) {
  return function (startToken, finishToken, tagInfo) {
    startToken.tag = finishToken.tag = tag;
    startToken.content = finishToken.content = "";

    startToken.type = "bbcode_open";
    finishToken.type = "bbcode_close";

    startToken.nesting = 1;
    finishToken.nesting = -1;

    startToken.attrs = [[attr, callback ? callback(tagInfo) : tagInfo.attrs._default]];
  };
}

/**
 * Parses an inputted size value and returns the formatted valid font size
 * @param {string} fontValue the input of the size
 */
export function parseFontSize(fontValue) {
  let value;
  let fontSize = { valid: true };
  const parsedSize = /(\d+\.?\d?)(px|rem)?/.exec(fontValue);
  const sizeRanges = {
    px_max: 36,
    px_min: 8,
    rem_max: 3,
    rem_min: 0.2,
    unitless_max: 7,
    unitless_min: 1,
  };

  fontSize.unit = parsedSize[2];
  if ((value = parsedSize[1])) {
    switch (fontSize.unit) {
      case "px":
        if (value > sizeRanges.px_max) {
          value = sizeRanges.px_max;
        } else if (value < sizeRanges.px_min) {
          value = sizeRanges.px_min;
        }
        break;
      case "rem":
        if (value > sizeRanges.rem_max) {
          value = sizeRanges.rem_max;
        } else if (value < sizeRanges.rem_min) {
          value = sizeRanges.rem_min;
        }
        break;
      default:
        if ((fontSize.valid = fontValue.length === value.length)) {
          if (value > sizeRanges.unitless_max) {
            value = sizeRanges.unitless_max;
          } else if (value < sizeRanges.unitless_min) {
            value = sizeRanges.unitless_min;
          }
        }
        break;
    }

    fontSize.value = value;
  }
  return fontSize;
}

/**
 * The following functions enables better rendering by adding commonly used classes and
 * making paragraph tag disappear
 */

function paragraphOpen() {
  return "";
}

function paragraphClose(tokens, idx, options /*, env */) {
  return options.xhtmlOut ? "<br />\n<br />\n" : "<br>\n<br>\n";
}
export function setup(helper) {
  helper.allowList(["div.bbcode-inline-block", "div.bbcode-inline"]);
  helper.registerPlugin((md) => {
    md.renderer.rules.paragraph_open = paragraphOpen;
    md.renderer.rules.paragraph_close = paragraphClose;
  });
}
