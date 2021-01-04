/**
 * Called from ./discourse/initializers/accordion.js.es6
 * Apply the onclick event listener to each slide tag.
 * @param {HTMLElement} slide
 */
function applySlide(slide) {
  slide.addEventListener("click", toggleBBCodeSlide);
}

/**
 * Given an event on the button of the accordion, it'll either slide up or slide down the content of the sibling
 * @param {Event} evt
 */
function toggleBBCodeSlide(evt) {
  function slideUp(target, duration) {
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.boxSizing = "border-box";
    target.style.height = target.offsetHeight + "px";
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(function () {
      target.style.display = "none";
      target.style.removeProperty("height");
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
    }, duration);
  }

  function slideDown(target, duration) {
    target.style.removeProperty("display");
    var display = window.getComputedStyle(target).display;

    if (display === "none") display = "block";

    target.style.display = display;
    var height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.boxSizing = "border-box";
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(function () {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
    }, duration);
  }

  function slideToggle(target, duration) {
    if (window.getComputedStyle(target).display === "none") {
      return slideDown(target, duration);
    } else {
      return slideUp(target, duration);
    }
  }

  function getChildren(n, skipMe, selector) {
    var r = [];
    for (; n; n = n.nextSibling)
      if (n.nodeType == 1 && n != skipMe && n.matches(selector)) r.push(n);
    return r;
  }

  /**
   *
   * @param {HTMLElement} n
   * @param {string} selector
   */
  function getSiblings(n, selector) {
    return getChildren(n.parentNode.firstChild, n, selector);
  }

  evt.currentTarget.classList.toggle("active");

  /** @type {HTMLElement[]} */
  var slide = evt.currentTarget.nextElementSibling;
  var siblingSlides = getSiblings(evt.currentTarget, ".bbcode-slide-title");
  var siblingContent = getSiblings(slide, ".bbcode-slide-content");

  siblingSlides.forEach(function (sibling) {
    sibling.classList.remove("active");
  });
  siblingContent.forEach(function (sibling) {
    slideUp(sibling, 500);
  });
  slideToggle(slide, 500);
}
