// Import dependencies
import Cookies from "./utilities/cookies.js";
import Options from "./lib/options.js";
import { loadChart } from "./utilities/loadChart.js";
import { updateDatabase } from "./utilities/updateDB.js";

// Initialize budgets and transactions
let budgets = { totalBudget: 0, totalSpent: 0, budgetList: {} };
budgets = Cookies.checkCookie("budgets")
  ? JSON.parse(Cookies.getCookie("budgets"))
  : budgets;
const budgetList = budgets.budgetList;
const transactionList = Cookies.checkCookie("transactions")
  ? JSON.parse(Cookies.getCookie("transactions")).transactionList
  : [];

// Calculate expense per category
const expensePerCat = transactionList.reduce((acc, curr) => {
  if (curr.type === "expense") {
    acc[curr.category] = (acc[curr.category] || 0) + Math.abs(curr.amount);
  }
  return acc;
}, {});

/**
 * Update and display the overview section with total budget, spent, and remaining amounts.
 */
const loadOverview = () => {
  document.getElementById("total-budget").innerHTML =
    Options.currency + budgets.totalBudget;
  document.getElementById("total-spent").innerHTML =
    Options.currency + budgets.totalSpent;
  document.getElementById("remaining").innerHTML =
    Options.currency + (budgets.totalBudget - budgets.totalSpent);
};

/**
 * Populate the category dropdown with available options.
 */
const setCategories = () => {
  const expenseOptions = Options.expenseCategories.map((cat) =>
    cat in budgetList ? "" : `<option value=${cat}>${cat}</option>`
  );

  document.getElementById("category").innerHTML = expenseOptions;
};

/**
 * Change the budget limit for a specific category.
 * @param {string} cat - The category to update.
 */
const changeBudgetLimit = (cat) => {
  const budgetCardsDiv = document.getElementsByClassName("budget-list")[0];
  const limitBox = document.getElementById("change-limit-box");
  const expenseInCat = cat in expensePerCat ? expensePerCat[cat] : 0;

  limitBox.getElementsByClassName("limit-category")[0].innerHTML = cat;
  limitBox.getElementsByClassName("limit-form")[0].onsubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newLimit = Number(form.limit.value);

    budgets.totalBudget -= budgetList[cat].budgetAmount;
    budgets.totalBudget += newLimit;
    budgetList[cat].budgetAmount = newLimit;

    Array.from(budgetCardsDiv.children).forEach((catCard) => {
      if (catCard.category === cat) {
        catCard.getElementsByClassName(
          "spent/amount-display field"
        )[0].innerHTML = `${Options.currency}${expenseInCat} / ${Options.currency}${budgetList[cat].budgetAmount}`;
        catCard.getElementsByClassName(
          "progress-bar field"
        )[0].style.width = `${
          (expenseInCat / budgetList[cat].budgetAmount) * 100
        }`;
      }
    });
    renderElements();

    Cookies.setCookie("budgets", JSON.stringify(budgets), 1);
    updateDatabase("budgets");
    limitBox.classList.remove("active");
  };

  limitBox.classList.add("active");
};

/**
 * Delete a budget category and update the UI.
 * @param {string} cat - The category to delete.
 */
const delBudget = (cat) => {
  const budgetCardsDiv = document.getElementsByClassName("budget-list")[0];

  Array.from(budgetCardsDiv.children).forEach((catCard) => {
    if (catCard.category === cat) {
      budgetCardsDiv.removeChild(catCard);
    }
  });

  budgets.totalSpent -= budgetList[cat].budgetSpent;
  budgets.totalBudget -= budgetList[cat].budgetAmount;
  delete budgetList[cat];

  if (Object.keys(budgetList).length === 0) {
    Cookies.deleteCookie("budgets");
  } else {
    Cookies.setCookie("budgets", JSON.stringify(budgets), 1);
  }

  updateDatabase("budgets");

  renderElements();
};

/**
 * Handle form submission to add a new budget category.
 */
const addBudget = (e) => {
  e.preventDefault();
  const form = e.target;
  const budgetAmount = Number(form.amount.value);
  const category = form.category.value;

  const budget = {
    budgetAmount,
    budgetSpent: category in expensePerCat ? expensePerCat[category] : 0,
    category,
  };

  budgets.totalSpent += budget.budgetSpent;
  budgets.totalBudget += budget.budgetAmount;
  budgetList[category] = budget;

  const card = createCard(budget);

  // Update the UI
  document.getElementsByClassName("budget-list")[0].appendChild(card);
  renderElements();

  Cookies.setCookie("budgets", JSON.stringify(budgets), 1);
  updateDatabase("budgets");
};

/**
 * Create a budget card for the UI.
 * @param {object} budget - The budget data for the card.
 * @returns {HTMLElement} The created card element.
 */
const createCard = (budget) => {
  let card = document.createElement("div");
  card.classList.add("budget");
  card.category = budget.category;
  card.innerHTML = `
    <label class="spent/amount-display">
      ${budget.category}
      <span class="spent/amount-display field">${Options.currency}${
    budget.budgetSpent
  } / ${Options.currency}${budget.budgetAmount}</span>
    </label>
    <div class="progress-bar"> 
      <span class="progress-bar field" style="width: ${
        (budget.budgetSpent / budget.budgetAmount) * 100
      }%"></span>
    </div>  
    <div class="action-buttons">
      <button class="limit-button">Change Limit</button>
      <button class="del-button"><i class="fa-solid fa-trash fa-xl"></i></button>
    </div>
  `;

  card
    .getElementsByClassName("del-button")[0]
    .addEventListener("click", () => delBudget(budget.category));

  card
    .getElementsByClassName("limit-button")[0]
    .addEventListener("click", () => changeBudgetLimit(budget.category));

  return card;
};

/**
 * Render all elements on the page: overview, chart, and budget cards.
 */
const renderElements = () => {
  loadOverview();
  if (budgets.totalBudget !== 0)
    loadChart(
      {
        labels: Object.keys(budgetList),
        data: Object.keys(budgetList).map((cat) => budgetList[cat].budgetSpent),
        total: budgets.totalSpent,
        limit: budgets.totalBudget,
      },
      Options
    );
  setCategories();
};

// Initialize budget cards from stored data
Object.keys(budgetList).forEach((cat) => {
  document
    .getElementsByClassName("budget-list")[0]
    .appendChild(createCard(budgetList[cat]));
});

// Initial render
renderElements();

document.getElementsByTagName("form")[0].onsubmit = addBudget;
