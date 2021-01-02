/**
 * @file Initializes any Accordion bbcode with proper js/event handling, by targeting the slide tag
 */

import { withPluginApi } from "discourse/lib/plugin-api";

/**
 * Adds the inline js for the slides of an accordion inside a given post
 * @param {HTMLElement} post the post itself
 */
function addSlideCode(post) {
  const accordions = post.querySelectorAll(".bbcode-accordion");
  // If no accordions found, end function
  if (!accordions.length) return;
  accordions.forEach((accordion) => {
    const slides = accordion.querySelectorAll(".bbcode-slide-title");
    // If the accordion has no slides, skip to the next one
    if (!slides.length) return;
    slides.forEach((slide) => applySlide(slide));
  });
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
