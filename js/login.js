import Cookies from "./utilities/cookies.js";

if (Cookies.checkCookie("user"))
  window.location.replace("http://localhost:5500/index.html");

document.getElementsByTagName("form")[0].onsubmit = (e) => {
  e.preventDefault();
  const form = e.target;

  fetch("http://127.0.0.1:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: form.email.value,
      password: form.password.value,
    }),
  }).then((response) => {
    response.json().then((data) => {
      if (response.ok) {
        Cookies.setCookie(
          "user",
          JSON.stringify({ _id: data._id, name: data.name })
        );
        if (
          data.transactions.totalIncome !== 0 ||
          data.transactions.totalExpense !== 0
        )
          Cookies.setCookie("transactions", JSON.stringify(data.transactions));
        if (data.budgets.totalBudget !== 0)
          Cookies.setCookie("budgets", JSON.stringify(data.budgets));
        if (data.pots.totalSaved !== 0)
          Cookies.setCookie("pots", JSON.stringify(data.pots));
        window.location.replace("http://localhost:5500/index.html");
      } else document.getElementsByClassName("error")[0].innerHTML = data;
    });
  });
};
