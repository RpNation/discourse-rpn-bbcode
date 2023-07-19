/**
 * @file Initializes any tab bbcode with the proper js/event handling
 */
import loadScript from "discourse/lib/load-script";
import { withPluginApi } from "discourse/lib/plugin-api";

/**
 * Adds the inline js for each [tab] inside [tabs]
 * @param {HTMLElement} post the post itself
 */
async function addTabsCode(post) {
  // get all [tabs] in post;
  const tabs = post.querySelectorAll(".bbcode-tab");
  if (!tabs.length) {
    return;
  }

  //lazy load in the tabs.js
  await loadScript("/plugins/discourse-rpn-bbcode/javascripts/tabs.js");

  tabs.forEach((element) => {
    const tab = element.querySelectorAll(".bbcode-tab-links");
    // eslint-disable-next-line no-undef
    tab.forEach((t) => applyTab(t));
  });
}

/**
 * The initial call function.
 * any calls to the PluginAPI should be done in here
 * @param api
 */
function initializeTabs(api) {
  api.decorateCookedElement(addTabsCode, { id: "add tabs" });
}

export default {
  name: "tabs",
  initialize() {
    withPluginApi("0.11.1", initializeTabs);
  },
};
