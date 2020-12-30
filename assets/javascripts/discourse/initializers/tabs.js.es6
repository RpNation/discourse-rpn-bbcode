/**
 * @file Initializes any tab bbcode with the proper js/event handling
 */
import { withPluginApi } from "discourse/lib/plugin-api";

/**
 * Adds the inline js for each [tab] inside [tabs]
 * @param {HTMLElement} post the post itself
 */
function addTabsCode(post) {
  // get all [tabs] in post;
  const tabs = post.querySelectorAll(".bbcode-tab");
  tabs.forEach((element) => {
    const tab = element.querySelectorAll(".bbcode-tab-links");
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
    withPluginApi("0.1", initializeTabs);
  },
};
