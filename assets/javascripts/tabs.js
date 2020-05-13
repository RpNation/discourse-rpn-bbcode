function openRPNTab(evt, RPNTabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("rpntabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("rpntablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(RPNTabName).style.display = "block";
  evt.currentTarget.className += " active";
}
