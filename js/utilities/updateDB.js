import Cookies from "./cookies.js";

const user = Cookies.checkCookie("user")
  ? JSON.parse(Cookies.getCookie("user"))
  : null;

let transactions;
let budgets;
let pots;
export const updateDatabase = (name) => {
  if (user === null) return;

  transactions = Cookies.checkCookie("transactions")
    ? JSON.parse(Cookies.getCookie("transactions"))
    : {
        totalIncome: 0,
        totalExpense: 0,
        transactionList: [],
      };
  budgets = Cookies.checkCookie("budgets")
    ? JSON.parse(Cookies.getCookie("budgets"))
    : {
        totalSpent: 0,
        totalBudget: 0,
        budgetList: {},
      };
  pots = Cookies.checkCookie("pots")
    ? JSON.parse(Cookies.getCookie("pots"))
    : { totalSaved: 0, potList: {} };

  let body = { _id: user._id };

  switch (name) {
    case "transactions":
      body = { ...body, field: "transactions", data: transactions };
      break;
    case "budgets":
      body = { ...body, field: "budgets", data: budgets };
      break;
    case "pots":
      body = { ...body, field: "pots", data: pots };
      break;
    default:
      break;
  }

  fetch("http://localhost:3000/edit", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
};
