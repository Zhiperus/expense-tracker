import Cookies from "./utilities/cookies.js";
import Options from "./lib/options.js";
import { loadChart } from "./utilities/loadChart.js";

let transactions = Cookies.checkCookie("transactions")
  ? JSON.parse(Cookies.getCookie("transactions"))
  : {
      transactionList: [],
      totalIncome: 0,
      totalExpense: 0,
    };
let budgets = Cookies.checkCookie("budgets")
  ? JSON.parse(Cookies.getCookie("budgets"))
  : {
      budgetList: {},
      totalSpent: 0,
      totalBudget: 0,
    };
let pots = Cookies.checkCookie("pots")
  ? JSON.parse(Cookies.getCookie("pots"))
  : { totalSaved: 0, potList: {} };
const transactionCards = document.getElementsByClassName("transaction-list")[0];
const potCards = document.getElementsByClassName("pot-list")[0];

transactions.transactionList.forEach((transaction) => {
  const card = document.createElement("div");
  card.classList.add("transaction");
  card.innerHTML = `<span>${transaction.category}</span><div><span class='${
    transaction.type
  }'> ${transaction.type === "income" ? "+" : "-"}₱${Math.abs(
    transaction.amount
  )}</span><span>${transaction.date}</span></div>`;

  transactionCards.appendChild(card);
});

if (transactions.totalIncome + transactions.totalExpense < 0)
  document.getElementsByClassName("amount-field")[0].children[0].innerHTML =
    "-" +
    Options.currency +
    Math.abs(transactions.totalIncome + transactions.totalExpense);
else
  document.getElementsByClassName("amount-field")[0].children[0].innerHTML +=
    Options.currency + (transactions.totalIncome + transactions.totalExpense);
document.getElementsByClassName("amount-field")[1].children[0].innerHTML +=
  Options.currency + transactions.totalIncome;
document.getElementsByClassName("amount-field")[2].children[0].innerHTML +=
  Options.currency + Math.abs(transactions.totalExpense);

if (budgets.totalBudget !== 0)
  loadChart(
    {
      labels: Object.keys(budgets.budgetList),
      data: Object.keys(budgets.budgetList).map(
        (cat) => budgets.budgetList[cat].budgetSpent
      ),
      total: budgets.totalSpent,
      limit: budgets.totalBudget,
    },
    Options
  );

document.getElementsByClassName("pots-saved-field")[0].innerHTML =
  Options.currency + pots.totalSaved;

Object.keys(pots.potList).forEach((potName) => {
  const card = document.createElement("div");
  card.classList.add("pot");
  card.innerHTML = `<span>${pots.potList[potName].name}</span><span>${Options.currency}${pots.potList[potName].currentBalance}</span>`;

  potCards.appendChild(card);
});
