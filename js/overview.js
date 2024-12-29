transactions = [];
let income = 0;
let expense = 0;

transactions = JSON.parse(localStorage.getItem("transactions"))
  ? JSON.parse(localStorage.getItem("transactions"))
  : [];

transactions.forEach((transaction) => {
  transaction.type === "income"
    ? (income += transaction.amount)
    : (expense += transaction.amount);
});

document.getElementsByClassName("number-field")[0].children[0].innerHTML +=
  income + expense;
document.getElementsByClassName("number-field")[1].children[0].innerHTML +=
  income;
document.getElementsByClassName("number-field")[2].children[0].innerHTML +=
  Math.abs(expense);
