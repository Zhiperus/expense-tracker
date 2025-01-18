import Cookies from "./cookies.js";

const user = Cookies.checkCookie("user")
  ? JSON.parse(Cookies.getCookie("user"))
  : null;

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
  navbar
    .getElementsByClassName("maximize-logo")[0]
    .classList.toggle("maximize-logo--show");
  navbar
    .getElementsByClassName("minimize-text")[0]
    .classList.toggle("minimize-button--hide");
  navbar.getElementsByClassName("user-profile")[0].inert =
    !navbar.getElementsByClassName("user-profile")[0].inert;
  navbar.getElementsByClassName("page-tabs")[0].inert =
    !navbar.getElementsByClassName("page-tabs")[0].inert;
};

includeHTML(() => {
  const page = document.getElementsByTagName("Title")[0].innerHTML;

  if (user) {
    document.getElementsByClassName("user-name")[0].innerHTML = user.name;
    document.getElementsByClassName("user-name")[0].style.visibility =
      "visible";
    document.getElementById("login-anc").removeAttribute("href");
    document.getElementById("login-anc").innerHTML = "Logout";
    document.getElementById("login-anc").style.backgroundColor = "red";
    document.getElementById("login-anc").onclick = () => {
      Cookies.deleteCookie("budgets");
      Cookies.deleteCookie("transactions");
      Cookies.deleteCookie("pots");
      Cookies.deleteCookie("user");
    };
  }

  if (page !== "Signup")
    document
      .getElementById(`${page.toLowerCase()}-anc`)
      .classList.add("selected");

  document
    .getElementById("minimize-button")
    .addEventListener("click", handleMinimize);

  const links = document.querySelectorAll("a");

  links.forEach((link) => {
    if (link.id === "minimize-button") return;

    link.addEventListener("click", (event) => {
      event.preventDefault();
      document
        .getElementsByClassName("main-content")[0]
        .classList.add("fade-out");
      setTimeout(() => {
        window.location.href = link.href;
      }, 100); // Match the 200ms transition duration
    });
  });
});
