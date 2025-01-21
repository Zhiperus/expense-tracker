import uuidv4 from "./utilities/UUID.js";
import Cookies from "./utilities/cookies.js";
import Options from "./lib/options.js";
import { updateDatabase } from "./utilities/updateDB.js";

/*** Variables Initialization ***/
let transactions = { totalIncome: 0, totalExpense: 0, transactionList: [] };
transactions = Cookies.checkCookie("transactions")
  ? JSON.parse(Cookies.getCookie("transactions"))
  : transactions;
const transactionList = transactions.transactionList;

const transactionCards = document.getElementsByClassName("transaction-list")[0];
const incomeOptions = Options.incomeCategories.map(
  (cat) => `<option value=${cat}>${cat}</option>`
);
const expenseOptions = Options.expenseCategories.map(
  (cat) => `<option value=${cat}>${cat}</option>`
);

/*** Utility Functions ***/
const updateBudgetsOnDelete = (transaction) => {
  if (
    transaction.type === "expense" &&
    Cookies.checkCookie("budgets") &&
    transaction.category in JSON.parse(Cookies.getCookie("budgets")).budgetList
  ) {
    const budgets = JSON.parse(Cookies.getCookie("budgets"));
    budgets.budgetList[transaction.category].budgetSpent -= Math.abs(
      transaction.amount
    );
    budgets.totalSpent -= Math.abs(transaction.amount);
    Cookies.setCookie("budgets", JSON.stringify(budgets), 1);
    updateDatabase("budgets");
  }
};

const updateBudgetsOnAdd = (transaction) => {
  if (
    transaction.type === "expense" &&
    Cookies.checkCookie("budgets") &&
    transaction.category in JSON.parse(Cookies.getCookie("budgets")).budgetList
  ) {
    const budgets = JSON.parse(Cookies.getCookie("budgets"));
    budgets.budgetList[transaction.category].budgetSpent += Math.abs(
      transaction.amount
    );
    budgets.totalSpent += Math.abs(transaction.amount);
    Cookies.setCookie("budgets", JSON.stringify(budgets), 1);
    updateDatabase("budgets");
  }
};

const delTransaction = (Id) => {
  const arrayIndex = transactionList
    .map((transaction) => transaction.Id)
    .indexOf(Id);
  const nodeIndex = Array.from(transactionCards.children)
    .map((transaction) => transaction.uid)
    .indexOf(Id);
  const transaction = transactionList[arrayIndex];

  transaction.type === "income"
    ? (transactions.totalIncome -= transaction.amount)
    : (transactions.totalExpense -= transaction.amount);
  updateBudgetsOnDelete(transaction);

  transactionList.splice(arrayIndex, 1);

  if (transactionList.length === 0) {
    Cookies.deleteCookie("transactions");
  } else {
    Cookies.setCookie("transactions", JSON.stringify(transactions), 1);
  }

  updateDatabase("transactions");

  transactionCards.removeChild(transactionCards.children[nodeIndex]);
};

const createCard = (transaction) => {
  let card = document.createElement("div");
  card.classList.add(`${transaction.type}-card`);
  card.uid = transaction.Id;
  card.innerHTML = `
    <div class="card-header">
      <span class="amount">
        ${transaction.type === "income" ? "+" : "-"}${
    Options.currency
  }${Math.abs(transaction.amount)}
      </span>
      <span class="time-date">
        ${transaction.date} | ${transaction.time}
      </span>
    </div>
    <div class="card-details">
      <p><strong>Category:</strong> ${transaction.category}</p>
      <p><strong>Note:</strong> ${transaction.note}</p>
      <button class="del-button"><i class="fa-solid fa-trash fa-xl"></i></button>
    </div>
  `;

  card
    .getElementsByClassName("del-button")[0]
    .addEventListener("click", () => delTransaction(transaction.Id));

  return card;
};

const timeFilter = (event) => {
  const choice = event.target.value;
  const dateObj = new Date();
  dateObj.setHours(0, 0, 0, 0);

  switch (choice) {
    case "today":
      break;
    case "this_week":
      const startOfWeek =
        dateObj.getDate() - dateObj.getDay() < 0
          ? dateObj.getDate()
          : dateObj.getDate() - dateObj.getDay();
      dateObj.setDate(startOfWeek);
      break;
    case "this_month":
      dateObj.setDate(1);
      break;
    case "all_time":
      dateObj.setFullYear(1970);
      break;
    default:
      throw new Error("Invalid date input!");
  }

  transactionCards.innerHTML = "";
  transactionList
    .filter(
      (transaction) => Date.parse(transaction.dateObj) > Date.parse(dateObj)
    )
    .forEach((transaction) =>
      transactionCards.appendChild(createCard(transaction))
    );
};

const renderInitialCards = () => {
  transactionList.forEach((transaction) => {
    transactionCards.appendChild(createCard(transaction));
  });
};

const setInitialOptions = () => {
  document.getElementById("category").innerHTML = incomeOptions;
};

/*** Event Listeners ***/
const setupFormSubmission = () => {
  document.getElementsByTagName("form")[0].onsubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const [h, m] = form.time.value.split(":"),
      [year, month, day] = form.date.value.split("-");
    const dateObj = new Date(year, month - 1, day, h, m);
    const [dayStr, monthStr, dayOfMonth, yearStr] = dateObj
      .toDateString()
      .split(" ");

    const transaction = {
      Id: uuidv4(),
      type: form.income.checked ? "income" : "expense",
      dateObj,
      date: `${monthStr} ${dayOfMonth}, ${yearStr}`,
      time: `${h % 12 ? h % 12 : 12}:${m} ${h >= 12 ? "PM" : "AM"}`,
      amount: form.income.checked ? +form.amount.value : -form.amount.value,
      category: form.category.value,
      account: form.account.value,
      note: form.note.value,
    };

    transaction.type === "income"
      ? (transactions.totalIncome += transaction.amount)
      : (transactions.totalExpense += transaction.amount);

    let card = createCard(transaction);
    let i = 0;

    if (transactionList.length === 0) {
      transactionList.push(transaction);
      transactionCards.appendChild(card);
    } else {
      for (; i < transactionList.length; i++) {
        if (
          Date.parse(transactionList[i].dateObj) <=
            Date.parse(transaction.dateObj) ||
          i === transactionList.length - 1
        ) {
          transactions.transactionList = [
            ...transactions.transactionList.slice(0, i),
            transaction,
            ...transactions.transactionList.slice(i),
          ];
          break;
        }
      }
    }

    updateBudgetsOnAdd(transaction);
    Cookies.setCookie("transactions", JSON.stringify(transactions), 1);
    updateDatabase("transactions");

    let next = transactionCards.children[i];
    next.parentNode.insertBefore(card, next);
  };
};

const setupRadioButtons = () => {
  document.getElementsByName("transaction-type").forEach((radioButton) => {
    radioButton.addEventListener(
      "click",
      () =>
        (document.getElementById("category").innerHTML =
          radioButton.id === "income" ? incomeOptions : expenseOptions)
    );
  });
};

const setupTimeFilter = () => {
  document.getElementById("select-time").addEventListener("change", timeFilter);
};

const init = () => {
  renderInitialCards();
  setInitialOptions();
  setupFormSubmission();
  setupRadioButtons();
  setupTimeFilter();
};

init();
