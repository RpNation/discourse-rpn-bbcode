/**
 * @file Find and adds google fonts to the site when the font bbcode is found with the data-bbcode-gfont attribute
 */
import { withPluginApi } from "discourse/lib/plugin-api";

/**
 * Adds relevant font links inside a given post
 * @param {HTMLElement} post the post itself
 */
function addGoogleFont(post) {
  const elements = post.querySelectorAll("[data-bbcode-gfont]");
  if (!elements.length) {
    return;
  }
  let frag = document.createDocumentFragment();
  const gFonts = [];
  Array.from(elements).map((e) => {
    const data = e.getAttribute("data-bbcode-gfont");
    if (!gFonts.includes(data)) {
      frag.appendChild(linkBuilder(data));
      gFonts.push(data);
    }
  });
  // Cleans up post if we're editing
  const priorLinks = post.querySelectorAll("link[data-rendered-gfont]");
  priorLinks.forEach((oldLink) => post.removeChild(oldLink));
  post.appendChild(frag);
}

/**
 * builds link tag for google api
 * @param data input for api link
 */
function linkBuilder(data) {
  let link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  // link.setAttribute("type", "text/css");
  link.setAttribute("href", `https://fonts.googleapis.com/css2?family=${data}`);
  link.setAttribute("data-rendered-gfont", data);
  return link;
}

/**
 * The initial call function.
 * Any calls to the PluginAPI should be done in here
 * @param api
 */
function initializeFont(api) {
  api.decorateCookedElement((elem) => addGoogleFont(elem), { id: "add google font" });
}

export default {
  name: "google font",
  initialize() {
    withPluginApi("0.11.1", initializeFont);
  },
};
