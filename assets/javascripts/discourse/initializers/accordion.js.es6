/**
 * @file Initializes any Accordion bbcode with proper js/event handling, by targeting the slide tag
 */
import loadScript from "discourse/lib/load-script";
import { withPluginApi } from "discourse/lib/plugin-api";

/**
 * Adds the inline js for the slides of an accordion inside a given post
 * @param {HTMLElement} post the post itself
 */
async function addSlideCode(post) {
  const accordions = post.querySelectorAll(".bbcode-accordion");
  // If no accordions found, end function
  if (!accordions.length) {
    return;
  }

  // Stores codes so it won't be in the regex
  const codeStorage = [];
  const codeList = post.getElementsByTagName("code");
  for (let i = 0; i < codeList.length; i++) {
    const num = codeStorage.push(codeList[i].innerHTML) - 1;
    codeList[i].innerHTML = "";
    codeList[i].setAttribute("data-code", num);
  }

  // Lazy load in the accordion.js
  await loadScript("/plugins/discourse-rpn-bbcode/javascripts/accordion.js");
  accordions.forEach((accordion) => {
    const slides = accordion.querySelectorAll(".bbcode-slide-title");
    // If the accordion has no slides, skip to the next one
    if (!slides.length) {
      return;
    }
    // eslint-disable-next-line no-undef
    slides.forEach((slide) => applySlide(slide));
  });

  // repopulates code
  for (let i = 0; i < codeList.length; i++) {
    const num = codeList[i].getAttribute("data-code");
    codeList[i].innerHTML = codeStorage[num];
    codeList[i].removeAttribute("data-code");
  }
}

/**
 * The initial call function.
 * Any calls to the PluginAPI should be done in here
 * @param api
 */
function initializeAccordion(api) {
  api.decorateCookedElement(addSlideCode, { id: "add accordions" });
}

export default {
  name: "accordion",
  initialize() {
    withPluginApi("0.11.1", initializeAccordion);
  },
};
