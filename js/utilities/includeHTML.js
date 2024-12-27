const includeHTML = (callback) => {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          elmnt.removeAttribute("include-html");
          includeHTML(callback);
        }
      };
      xhttp.open("GET", "http://localhost:5500/html/components/" + file, true);
      xhttp.send();
      return;
    }
  }
  if (typeof callback === "function") callback();
};

const handleMinimize = () => {
  const navbar = document.getElementsByTagName("nav")[0];
  navbar.classList.toggle("nav--minimize");
  navbar.getElementsByTagName("img")[0].classList.toggle("open-logo--show");
  console.log(navbar.getElementsByTagName("img")[0]);
};
includeHTML(() => {
  document
    .getElementById("minimize-button")
    .addEventListener("click", handleMinimize);
});
