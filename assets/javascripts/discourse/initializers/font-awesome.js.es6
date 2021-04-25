/**
 * @file Find and transform Font Awesome Icons.
 */
import loadScript from "discourse/lib/load-script";
import { withPluginApi } from "discourse/lib/plugin-api";

/**
 * transform all Font Awesome Icons
 * @param {HTMLElement} post the post itself
 */
async function transformFontAwesome(post) {
  const nobrTags = post.querySelectorAll("i[data-bbcode-font-awesome]");
  if (!nobrTags.length) {
    return;
  }
  await loadScript("/plugins/discourse-rpn-bbcode/javascripts/font-awesome.js");
  if (window.FontAwesome) {
    window.FontAwesomeConfig.autoReplaceSvg = "nest";
    window.FontAwesome.dom.i2svg({ node: post });
    window.FontAwesomeConfig.autoReplaceSvg = false;
  }
}

/**
 * The initial call function.
 * Any calls to the PluginAPI should be done in here
 * @param api
 */
function initializeFA(api) {
  api.decorateCookedElement((elem) => transformFontAwesome(elem), {
    id: "FontAwesome Transformer",
  });
}

export default {
  name: "fa",
  initialize() {
    withPluginApi("0.11.1", initializeFA);
  },
};
