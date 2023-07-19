/**
 * @file Find and transform Font Awesome Icons.
 */
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
  if (window.FontAwesome) {
    applyFontAwesome(post);
  } else {
    if (window.awaitingRender) {
      window.awaitingRender.push(post);
    } else {
      window.awaitingRender = [post];
    }
    Object.defineProperty(window, "FontAwesome", {
      configurable: true,
      set(v) {
        Object.defineProperty(window, "FontAwesome", {
          configurable: true,
          enumerable: true,
          writable: true,
          value: v,
        });
        window.awaitingRender.forEach((unrendered) => applyFontAwesome(unrendered));
        delete window.awaitingRender;
      },
    });
  }
}

/**
 * Applies FontAwesome to the post
 * @param {HTMLElement} post post to apply font awesome to
 */
function applyFontAwesome(post) {
  window.FontAwesomeConfig.autoReplaceSvg = "nest";
  window.FontAwesome.dom.i2svg({ node: post });
  window.FontAwesomeConfig.autoReplaceSvg = false;
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
