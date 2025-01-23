import Cookies from "./utilities/cookies.js";

const image = document.querySelector(".trend-figure");
const daysLeftText = document.querySelector(".days-left");
const budgetWarning = document.querySelector(".budget-warning");

const transactions = Cookies.checkCookie("transactions")
  ? JSON.parse(Cookies.getCookie("transactions"))
  : undefined;
const budgets = Cookies.checkCookie("budgets")
  ? JSON.parse(Cookies.getCookie("budgets"))
  : undefined;
let cumulative = [];

if (budgets && transactions && transactions.transactionList.length > 5) {
  const reversedList = transactions.transactionList.reverse();

  let currentDate = new Date(reversedList[0].dateObj).getDate();
  let currentTotal = 0;
  reversedList.forEach((transaction, index) => {
    if (transaction.type === "expense") {
      if (new Date(transaction.dateObj).getDate() != currentDate) {
        cumulative.push(
          (cumulative[cumulative.length - 1]
            ? cumulative[cumulative.length - 1]
            : 0) + currentTotal
        );
        currentTotal = 0;
        currentDate = new Date(transaction.dateObj).getDate();
      }

      currentTotal += Math.abs(transaction.amount);

      if (index === reversedList.length - 1)
        cumulative.push(
          (cumulative[cumulative.length - 1]
            ? cumulative[cumulative.length - 1]
            : 0) + currentTotal
        );
    }
  });

  fetch("http://127.0.0.1:3000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ totalBudget: budgets.totalBudget, cumulative }),
  }).then((response) => {
    response.json().then((data) => {
      image.src = data.figure;
      daysLeftText.textContent = `Days left before budget is reached: ${
        30 - data.daysLeft
      }`;
      budgetWarning.textContent = `Your budget will run out in day ${data.daysLeft}. Plan accordingly.`;
    });
  });

  document.querySelector(".trend-container").style.visibility = "visible";
} else {
  document.querySelector(".trend-container").style.visibility = "hidden";
}
