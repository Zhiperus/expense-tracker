import Cookies from "./cookies.js";

// Fetch user data from cookies
const getUserFromCookies = () => {
  const userCookie = Cookies.checkCookie("user")
    ? Cookies.getCookie("user")
    : null;
  return userCookie ? JSON.parse(userCookie) : null;
};

const user = getUserFromCookies();

// Function to include external HTML content
const includeHTML = (callback) => {
  const elements = document.getElementsByTagName("*");

  for (let element of elements) {
    const file = element.getAttribute("include-html");
    if (file) {
      fetch(`http://localhost:5500/html/components/${file}`)
        .then((response) => {
          if (response.ok) return response.text();
          throw new Error("Page not found.");
        })
        .then((html) => {
          element.innerHTML = html;
          element.removeAttribute("include-html");
          includeHTML(callback); // Recursively process remaining elements
        })
        .catch((error) => {
          element.innerHTML = error.message;
          element.removeAttribute("include-html");
          includeHTML(callback);
        });
      return; // Exit after processing the first include-html element
    }
  }

  if (typeof callback === "function") callback();
};

// Function to handle navbar minimization
const handleMinimize = () => {
  const navbar = document.querySelector("nav");
  navbar.classList.toggle("nav--minimize");

  const maximizeLogo = navbar.querySelector(".maximize-logo");
  const minimizeText = navbar.querySelector(".minimize-text");
  const userProfile = navbar.querySelector(".user-profile");
  const pageTabs = navbar.querySelector(".page-tabs");

  maximizeLogo.classList.toggle("maximize-logo--show");
  minimizeText.classList.toggle("minimize-button--hide");
  userProfile.inert = !userProfile.inert;
  pageTabs.inert = !pageTabs.inert;
};

// Function to update the UI based on user login state
const updateUIForUser = () => {
  if (user) {
    const userNameElement = document.querySelector(".user-name");
    const loginButton = document.getElementById("login-anc");

    userNameElement.innerHTML = user.name;
    userNameElement.style.visibility = "visible";

    loginButton.removeAttribute("href");
    loginButton.innerHTML = "Logout";
    loginButton.style.backgroundColor = "red";
    loginButton.onclick = () => {
      ["budgets", "transactions", "pots", "user"].forEach((cookie) =>
        Cookies.deleteCookie(cookie)
      );
    };
  }
};

// Function to highlight the current page in the navbar
const highlightCurrentPage = () => {
  const currentPage = document.querySelector("title").innerHTML.toLowerCase();
  if (currentPage !== "signup") {
    document.getElementById(`${currentPage}-anc`).classList.add("selected");
  }
};

// Function to handle link clicks with a fade-out effect
const setupLinkTransitions = () => {
  const links = document.querySelectorAll("a");

  links.forEach((link) => {
    if (link.id === "minimize-button") return;

    link.addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelector(".main-content").classList.add("fade-out");
      setTimeout(() => {
        window.location.href = link.href;
      }, 100); // Match the 200ms transition duration
    });
  });
};

// Main initialization function
const initializeApp = () => {
  includeHTML(() => {
    updateUIForUser();
    highlightCurrentPage();

    document
      .getElementById("minimize-button")
      .addEventListener("click", handleMinimize);

    setupLinkTransitions();
  });
};

// Start the app
initializeApp();
