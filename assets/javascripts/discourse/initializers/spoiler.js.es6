/**
 * @file Initializes any spoiler tag with proper js/event handling
 */

import { withPluginApi } from "discourse/lib/plugin-api";

/**
 * Adds the inline js for spoilers inside a given post
 * @param {HTMLElement} post the post itself
 */
function addSpoilerCode(post) {
  /** all of the elements that contain the class `.bbcode-spoiler-button` */
  const spoilers = post.querySelectorAll(".bbcode-spoiler-button");
  if (!spoilers.length) return;

  spoilers.forEach((spoiler) => {
    applySpoiler(spoiler);
  });
}

/**
 * The initial called function.
 * Any calls to the PluginAPI should be done in here
 * @param api
 */
function initializeSpoiler(api) {
  api.decorateCookedElement(addSpoilerCode, { id: "add spoilers", onlyStream: true });
}

export default {
  name: "spoiler",
  initialize() {
    withPluginApi("0.1", initializeSpoiler);
  },
};
