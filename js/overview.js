import Cookies from "./utilities/cookies.js";
import Options from "./lib/options.js";

let transactions = [];
let income = 0;
let expense = 0;
const transactionList = document.getElementsByClassName("transaction-list")[0];

transactions = Cookies.checkCookie("transactions")
  ? JSON.parse(Cookies.getCookie("transactions"))
  : [];

transactions.forEach((transaction) => {
  transaction.type === "income"
    ? (income += transaction.amount)
    : (expense += transaction.amount);

  const card = document.createElement("div");
  card.classList.add("transaction");
  card.innerHTML = `<span>${transaction.category}</span><div><span class='${
    transaction.type
  }'> ${transaction.type === "income" ? "+" : "-"}₱${Math.abs(
    transaction.amount
  )}</span><span>${transaction.date}</span></div>`;

  transactionList.appendChild(card);
});

console.log();
document.getElementsByClassName("amount-field")[0].children[0].innerHTML +=
  Options.currency + (income + expense);
document.getElementsByClassName("amount-field")[1].children[0].innerHTML +=
  Options.currency + income;
document.getElementsByClassName("amount-field")[2].children[0].innerHTML +=
  Options.currency + Math.abs(expense);
