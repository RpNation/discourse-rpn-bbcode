function openRPNTab(evt) {
  let i, tabcontent, tablinks;
  let parent = evt.currentTarget.parentElement;

  tabcontent = parent.getElementsByClassName("rpntabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = parent.getElementsByClassName("rpntablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  evt.currentTarget.nextElementSibling.style.display = "block";
  evt.currentTarget.className += " active";
}
