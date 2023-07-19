/**
 * @file Find and removes linebreaks inside the [nobr] tag
 */
import { withPluginApi } from "discourse/lib/plugin-api";

/**
 * removes line breaks from nobr
 * @param {HTMLElement} post the post itself
 */
function removeBr(post) {
  // Cleans up post if we're editing
  const nobrTags = post.querySelectorAll("div[data-bbcode-nobr]");
  if (!nobrTags.length) {
    return;
  }
  nobrTags.forEach((nobr) => {
    nobr.innerHTML = nobr.innerHTML.replaceAll(/(<br>|<p>|<\/p>)/gi, "");
  });
}

/**
 * The initial call function.
 * Any calls to the PluginAPI should be done in here
 * @param api
 */
function initializeNOBR(api) {
  api.decorateCookedElement((elem) => removeBr(elem), { id: "removes line breaks" });
}

export default {
  name: "nobr",
  initialize() {
    withPluginApi("0.11.1", initializeNOBR);
  },
};
