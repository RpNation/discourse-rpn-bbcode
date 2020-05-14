function openRPNTab(evt) {
  let parent = evt.currentTarget.parentElement;

  var tabcontent = parent.getElementsByClassName("rpntabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  var tablinks = parent.getElementsByClassName("rpntablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  evt.currentTarget.nextElementSibling.style.display = "block";
  evt.currentTarget.className += " active";
}
