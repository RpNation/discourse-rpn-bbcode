/* eslint-disable no-var */
/* eslint-disable no-unused-vars */

/**
 * Called from ./discourse/initializers/ispoiler.js.es6
 * Apply the onlick event listener to each ispoiler
 * @param {HTMLElement} spoiler the elemen to apply the ispoiler to
 */
function applyISpoiler(spoiler) {
  spoiler.addEventListener("click", toggleISpoiler);
}

/**
 * Given an event on the ispoiler, toggle the visiblity.
 * @param {MouseEvent} evt
 */
function toggleISpoiler(evt) {
  var spoiler = evt.target;
  if (spoiler.classList.contains("ispoiler")) {
    spoiler.classList.remove("ispoiler");
  } else {
    spoiler.classList.add("ispoiler");
  }
}
