import Cookies from "./utilities/cookies.js";

let transactions = [];
let income = 0;
let expense = 0;

transactions = JSON.parse(Cookies.getCookie("transactions"))
  ? JSON.parse(Cookies.getCookie("transactions"))
  : [];

transactions.forEach((transaction) => {
  transaction.type === "income"
    ? (income += transaction.amount)
    : (expense += transaction.amount);
});

document.getElementsByClassName("amount-field")[0].children[0].innerHTML +=
  income + expense;
document.getElementsByClassName("amount-field")[1].children[0].innerHTML +=
  income;
document.getElementsByClassName("amount-field")[2].children[0].innerHTML +=
  Math.abs(expense);
