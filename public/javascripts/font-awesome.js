/* eslint-disable no-unused-vars */

/**
 * Applies FontAwesome to the post
 * @param {HTMLElement} post post to apply font awesome to
 */
function applyFontAwesome(post) {
  window.FontAwesomeConfig.autoReplaceSvg = "nest";
  window.FontAwesome.dom.i2svg({ node: post });
  window.FontAwesomeConfig.autoReplaceSvg = false;
}
