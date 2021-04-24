/**
 * @file Initializes any ispoiler tag with proper js/event handling
 */
import loadScript from "discourse/lib/load-script";
import { withPluginApi } from "discourse/lib/plugin-api";

/**
 * Adds the inline js for spoilers inside a given post
 * @param {HTMLElement} post the post itself
 */
async function addSpoilerCode(post) {
  /** all of the elements that contain the class `.ispoiler` */
  const spoilers = post.querySelectorAll("span.ispoiler");
  // if no spoilers found, end function
  if (!spoilers.length) {
    return;
  }

  // lazy load in the ispoiler.js
  await loadScript("/plugins/discourse-rpn-bbcode/javascripts/ispoiler.js");
  spoilers.forEach((spoiler) => {
    // eslint-disable-next-line no-undef
    applyISpoiler(spoiler);
  });
}

/**
 * The initial called function.
 * Any calls to the PluginAPI should be done in here
 * @param api
 */
function initializeSpoiler(api) {
  api.decorateCookedElement(addSpoilerCode, { id: "add ispoilers" });
}

export default {
  name: "ispoiler",
  initialize() {
    withPluginApi("0.11.1", initializeSpoiler);
  },
};
