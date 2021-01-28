/**
 * @file Find and removes orphaned p tags
 */
import { withPluginApi } from "discourse/lib/plugin-api";

/**
 * removes orphaned p tags
 * @param {HTMLElement} post the post itself
 */
function removePara(post) {
  // Cleans up post if we're editing
  post.querySelectorAll("div[data-bbcode-nobr]");
  post.innerHTML = post.innerHTML
    .replaceAll(/(<p><\/p><div)/gi, "<div")
    .replaceAll(/(<\/div><p><\/p>)/gi, "</div>")
    .replaceAll(/(<p><\/p>)/gi, "<br>");
}

/**
 * The initial call function.
 * Any calls to the PluginAPI should be done in here
 * @param api
 */
function initializeParaClean(api) {
  // api.decorateCookedElement((elem) => removePara(elem), { id: "cleans up orphaned p tags" });
}

export default {
  name: "p clean up",
  initialize() {
    withPluginApi("0.11.1", initializeParaClean);
  },
};
