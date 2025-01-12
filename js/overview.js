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
const transactionList = document.getElementsByClassName("transaction-list")[0];

// Financial Overview
transactions.transactionList.forEach((transaction) => {
  const card = document.createElement("div");
  card.classList.add("transaction");
  card.innerHTML = `<span>${transaction.category}</span><div><span class='${
    transaction.type
  }'> ${transaction.type === "income" ? "+" : "-"}₱${Math.abs(
    transaction.amount
  )}</span><span>${transaction.date}</span></div>`;

  transactionList.appendChild(card);
});

document.getElementsByClassName("amount-field")[0].children[0].innerHTML +=
  Options.currency + (transactions.totalIncome + transactions.totalExpense);
document.getElementsByClassName("amount-field")[1].children[0].innerHTML +=
  Options.currency + transactions.totalIncome;
document.getElementsByClassName("amount-field")[2].children[0].innerHTML +=
  Options.currency + Math.abs(transactions.totalExpense);

if (budgets.totalBudget !== 0)
  // Budgets
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
