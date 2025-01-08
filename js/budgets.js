import Cookies from "./utilities/cookies.js";
import Options from "./lib/options.js";

let budgets = Cookies.checkCookie("budgets")
  ? JSON.parse(Cookies.getCookie("budgets"))
  : {};
let transactions = Cookies.checkCookie("transactions")
  ? JSON.parse(Cookies.getCookie("transactions"))
  : [];
const expensePerCat = transactions.reduce(
  (acc, curr) => (
    curr.type === "expense" &&
      (curr.category in acc
        ? (acc[curr.category] += Math.abs(curr.amount))
        : (acc[curr.category] = Math.abs(curr.amount))),
    acc
  ),
  {}
);
let totalBudget = 0;
let totalSpent = 0;

// Load chart
const loadChart = (labels) => {
  const ctx = document.getElementById("pieChart").getContext("2d");
  const pieChart = new Chart(ctx, {
    type: "doughnut", // Change the chart type to 'doughnut'
    data: {
      labels: labels,
      datasets: [
        {
          data: Object.keys(budgets).reduce(
            (acc, curr) => [...acc, budgets[curr].budgetSpent],
            []
          ), // Adjust values to match the image example
          backgroundColor: ["#00A9CE", "#005F73", "#94D2BD", "#FFDDD2"], // Use colors similar to the image
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      cutout: "70%", // Creates the inner hollow circle for a donut look
      plugins: {
        legend: {
          display: true, // Hides legend to focus on the center label
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  });

  // Central Text for the Doughnut Chart
  const centerText = {
    id: "centerText",
    beforeDraw(chart) {
      const { width } = chart;
      const { height } = chart;
      const ctx = chart.ctx;
      ctx.save();
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#333";

      const centerX = width / 2;
      const centerY = height / 2;

      ctx.fillText(`${Options.currency}${totalSpent}`, centerX, centerY - 10);
      ctx.font = "15px Arial";
      ctx.fillText(
        `of ${Options.currency}${totalBudget} limit`,
        centerX,
        centerY + 30
      );
    },
  };

  Chart.register(centerText);
};

const loadOverview = () => {
  Object.keys(budgets).forEach((cat) => {
    totalBudget += budgets[cat].budgetAmount;
    totalSpent += budgets[cat].budgetSpent;
  });

  document.getElementById("total-budget").innerHTML =
    Options.currency + totalBudget;
  document.getElementById("total-spent").innerHTML =
    Options.currency + totalSpent;
  document.getElementById("remaining").innerHTML =
    Options.currency + (totalBudget - totalSpent);
};

const delBudget = (cat) => {
  const budgetCardsDiv = document.getElementsByClassName("categories")[0];

  Array.from(budgetCardsDiv.children).forEach((catCard) => {
    if (catCard.category === cat) {
      budgetCardsDiv.removeChild(catCard);
    }
  });

  delete budgets[cat];

  Cookies.setCookie("budgets", JSON.stringify(budgets), 1);

  setCategories();
};

const changeBugdetLimit = (cat) => {
  const limitBox = document.getElementById("change-limit-box");

  limitBox.getElementsByClassName("limit-category")[0].innerHTML = cat;
  limitBox.getElementsByClassName("limit-form")[0].onsubmit = (e) => {
    const form = e.target;
    const newLimit = Number(form.limit.value);
    budgets[cat].budgetAmount = newLimit;

    Cookies.setCookie("budgets", JSON.stringify(budgets), 1);

    limitBox.classList.remove("active");
  };

  limitBox.classList.add("active");
};

// Card creation
const createCard = (budget) => {
  const expenseInCat =
    budget.category in expensePerCat ? expensePerCat[budget.category] : 0;

  let card = document.createElement("div");
  card.classList.add(`category`);
  card.category = budget.category;
  card.innerHTML = `
      <label>
        ${budget.category}
          <span>${Options.currency}${expenseInCat} / ${Options.currency}${
    budget.budgetAmount
  }</span>
      </label>
      <div class="progress-bar"> 
        <span style="width: ${
          (expenseInCat / budget.budgetAmount) * 100
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
    .addEventListener("click", () => changeBugdetLimit(budget.category));

  return card;
};

// Set categories
const setCategories = () => {
  const expenseOptions = Options.expenseCategories.map((cat) =>
    cat in budgets ? "" : `<option value=${cat}>${cat}</option>`
  );

  document.getElementById("category").innerHTML = expenseOptions;
};

/****  Initial render ****/

// Render cards from the budgets taken from cookies
Object.keys(budgets).forEach((cat) =>
  document
    .getElementsByClassName("categories")[0]
    .appendChild(createCard(budgets[cat]))
);
loadOverview();
loadChart(Object.keys(budgets));
setCategories();

// On form submit
document.getElementsByTagName("form")[0].onsubmit = (e) => {
  e.preventDefault();
  const form = e.target;
  const budgetAmount = Number(form.amount.value);
  const category = form.category.value;

  const budget = {
    budgetAmount,
    budgetSpent: category in expensePerCat ? expensePerCat[category] : 0,
    category,
  };
  budgets[category] = budget;

  const card = createCard(budget);

  Cookies.setCookie("budgets", JSON.stringify(budgets), 1);

  document.getElementsByClassName("categories")[0].appendChild(card);

  loadOverview();
  loadChart(Object.keys(budgets));
  setCategories();
};
