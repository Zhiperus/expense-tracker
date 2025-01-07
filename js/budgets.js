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

// Load chart
const loadChart = () => {
  const ctx = document.getElementById("pieChart").getContext("2d");
  const pieChart = new Chart(ctx, {
    type: "doughnut", // Change the chart type to 'doughnut'
    data: {
      labels: ["Food", "Transport", "Entertainment", "Others"],
      datasets: [
        {
          data: [338, 200, 300, 137], // Adjust values to match the image example
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
          display: false, // Hides legend to focus on the center label
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

      ctx.fillText("$338", centerX, centerY - 10);
      ctx.font = "15px Arial";
      ctx.fillText("of $975 limit", centerX, centerY + 30);
    },
  };

  Chart.register(centerText);
};

const loadOverview = () => {
  let totalBudget = 0;
  let totalSpent = 0;

  Object.keys(budgets).forEach((cat) => {
    totalBudget += Number(budgets[cat].budgetAmount);
    totalSpent += budgets[cat].budgetSpent;
  });

  document.getElementById("total-budget").innerHTML =
    Options.currency + totalBudget;
  document.getElementById("total-spent").innerHTML =
    Options.currency + totalSpent;
  document.getElementById("remaining").innerHTML =
    Options.currency + (totalBudget - totalSpent);
};

// Card creation
const createCard = (budget) => {
  let card = document.createElement("div");
  card.classList.add(`category`);
  card.innerHTML = `
      <label>
        Transport
          <span>${Options.currency}${expensePerCat[budget.category]} / ${
    Options.currency
  }${budget.budgetAmount}</span>
      </label>
      <div class="progress-bar">
        <span style="width: ${
          (expensePerCat[budget.category] / budget.budgetAmount) * 100
        }%"></span>
      </div>
  `;

  return card;
};

// Set categories
const setCategories = () => {
  let expenseOptions = Options.expenseCategories.map((cat) =>
    cat in budgets ? "" : `<option value=${cat}>${cat}</option>`
  );

  document.getElementById("category").innerHTML = expenseOptions;
};

// Initial render
Object.keys(budgets).forEach((cat) =>
  document
    .getElementsByClassName("categories")[0]
    .appendChild(createCard(budgets[cat]))
);

loadOverview();
loadChart();
setCategories();

// On form submit
document.getElementsByTagName("form")[0].onsubmit = (e) => {
  e.preventDefault();
  const form = e.target;
  const budgetAmount = form.amount.value;
  const category = form.category.value;

  const budget = {
    budgetAmount,
    budgetSpent: expensePerCat[category],
    category,
  };
  budgets[category] = budget;

  const card = createCard(budget);

  Cookies.setCookie("budgets", JSON.stringify(budgets), 1);

  document.getElementsByClassName("categories")[0].appendChild(card);

  setCategories();
};
