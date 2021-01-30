/**
 * @file Removes the first line break in the whole post. used to patch the fix for paragraph removal
 */
import { withPluginApi } from "discourse/lib/plugin-api";

/**
 * removes the first <br> of a post
 * @param {HTMLElement} post the post itself
 */
async function removeBr(post) {
  /** all of the elements that contain the class `.bbcode-spoiler-button` */
  const firstChild = post.childNodes[0];
  if (firstChild.tagName === "BR") {
    firstChild.setAttribute("style", "display: none");
  }
}

/**
 * The initial called function.
 * Any calls to the PluginAPI should be done in here
 * @param api
 */
function initializeSpoiler(api) {
  api.decorateCookedElement(removeBr, { id: "remove br" });
}

export default {
  name: "remove br",
  initialize() {
    withPluginApi("0.11.1", initializeSpoiler);
  },
};
