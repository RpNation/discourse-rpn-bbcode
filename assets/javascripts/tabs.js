function openBBCodeTab(evt) {
  var parent = evt.currentTarget.parentElement;

  var tabcontent = parent.getElementsByClassName("bbcode-tab-content");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  var tablinks = parent.getElementsByClassName("bbcode-tab-links");
  for (var i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  evt.currentTarget.nextElementSibling.style.display = "block";
  evt.currentTarget.className += " active";
}
