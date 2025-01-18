import Cookies from "./utilities/cookies.js";

if (Cookies.checkCookie("user"))
  window.location.replace("http://localhost:5500/index.html");

const transactions = Cookies.checkCookie("transactions")
  ? JSON.parse(Cookies.getCookie("transactions"))
  : {
      totalIncome: 0,
      totalExpense: 0,
      transactionList: [],
    };
const budgets = Cookies.checkCookie("budgets")
  ? JSON.parse(Cookies.getCookie("budgets"))
  : {
      totalSpent: 0,
      totalBudget: 0,
      budgetList: {},
    };
const pots = Cookies.checkCookie("pots")
  ? JSON.parse(Cookies.getCookie("pots"))
  : { totalSaved: 0, potList: {} };

document.getElementsByTagName("form")[0].onsubmit = (e) => {
  e.preventDefault();
  const form = e.target;
  const user = {
    name: form.name.value,
    email: form.email.value,
    password: form.password.value,
    transactions,
    budgets,
    pots,
  };

  fetch("http://127.0.0.1:3000/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  }).then((response) =>
    response.json().then((data) => {
      Cookies.setCookie("user", { _id: data._id, name: data.name });
    })
  );
};
