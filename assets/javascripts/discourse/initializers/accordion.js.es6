/**
 * @file Initializes any Accordion bbcode with proper js/event handling, by targeting the slide tag
 */
import loadScript from "discourse/lib/load-script";
import { withPluginApi } from "discourse/lib/plugin-api";

const SLIDE_OPEN_REGEX = /(\{slide=([\s\S]+?)\})/gim;
const SLIDE_CLOSE_REGEX = /(\{\/slide\}(<br>)*)/gim;

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
  accordions.forEach((accordion) => {
    let rawHTML = accordion.innerHTML;
    rawHTML = rawHTML.replace(SLIDE_OPEN_REGEX, (...match) => {
      const parsed = slideParser(match[2]);
      return `<button class="bbcode-slide-title" ${parsed.data}>${
        parsed.title
      }</button><div class="bbcode-slide-content" ${parsed.open ? 'style="display: block;"' : ""}>`;
    });
    rawHTML = rawHTML.replace(SLIDE_CLOSE_REGEX, "</div>");
    accordion.innerHTML = rawHTML;
  });

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
 * Parses the input slide for options
 * @param {string} input
 */
function slideParser(input) {
  let inputArray = input.split("|");
  const parsed = { data: "" };
  if (inputArray.length === 1) {
    parsed.title = input;
    return parsed;
  }
  inputArray = inputArray.map((value) => value.trim());
  if (inputArray.includes("open")) {
    const index = inputArray.indexOf("open");
    inputArray.splice(index, 1);
    parsed.open = true;
  }
  if (inputArray.includes("left")) {
    const index = inputArray.indexOf("left");
    inputArray.splice(index, 1);
    parsed.data += 'data-bbcode-slide-align="left" ';
  }
  if (inputArray.includes("right")) {
    const index = inputArray.indexOf("right");
    inputArray.splice(index, 1);
    parsed.data += 'data-bbcode-slide-align="right" ';
  }
  if (inputArray.includes("center")) {
    const index = inputArray.indexOf("center");
    inputArray.splice(index, 1);
    parsed.data += 'data-bbcode-slide-align="center" ';
  }
  if (inputArray.length) {
    parsed.title = inputArray[0];
  }
  return parsed;
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
