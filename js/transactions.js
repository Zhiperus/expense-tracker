import uuidv4 from "./utilities/UUID.js";
import Cookies from "./utilities/cookies.js";
import Options from "./lib/options.js";

let transactions = [];
const transactionCards = document.getElementsByClassName("transaction-list")[0];

const delTransaction = (Id) => {
  const arrayIndex = transactions
    .map((transaction) => transaction.Id)
    .indexOf(Id);
  const nodeIndex = Array.from(transactionCards.children)
    .map((transaction) => transaction.uid)
    .indexOf(Id);

  transactions.splice(arrayIndex, 1);

  Cookies.setCookie("transactions", JSON.stringify(transactions), 1);

  transactionCards.removeChild(transactionCards.children[nodeIndex]);
};

const createCard = (transaction) => {
  let card = document.createElement("div");
  card.classList.add(`${transaction.type}-card`);
  card.uid = transaction.Id;
  card.innerHTML = `
  <div class="card-header">
    <span class="amount">
      ${transaction.type === "income" ? "+" : "-"}${Options.currency}${Math.abs(
    transaction.amount
  )}
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

transactions = Cookies.getCookie("transactions")
  ? JSON.parse(Cookies.getCookie("transactions"))
  : [];

for (let i = 0; i < transactions.length; i++) {
  transactionCards.appendChild(createCard(transactions[i]));
}

document.getElementsByTagName("form")[0].onsubmit = (e) => {
  e.preventDefault();
  const form = e.target;
  const [h, m] = form.time.value.split(":");
  const [year, month, day] = form.date.value.split("-");
  const dateObj = new Date(year, month - 1, day, h, m);
  const [dayStr, monthStr, dayOfMonth, yearStr] = dateObj
    .toDateString()
    .split(" ");

  const transaction = {
    Id: uuidv4(),
    type: form.income.checked === true ? "income" : "expense",
    dateObj,
    date: `${monthStr} ${dayOfMonth}, ${yearStr}`,
    time: `${h % 12 ? h % 12 : 12}:${m} ${h >= 12 ? "PM" : "AM"}`,
    amount:
      form.income.checked === true ? +form.amount.value : -form.amount.value,
    category: form.category.value,
    account: form.account.value,
    note: form.note.value,
  };

  let card = createCard(transaction);

  let i = 0;
  if (transactions.length === 0) {
    transactions.push(transaction);

    document.getElementsByClassName("transaction-list")[0].appendChild(card);
  } else {
    for (; i < transactions.length; i++) {
      if (
        Date.parse(transactions[i].dateObj) <=
          Date.parse(transaction.dateObj) ||
        i === transactions.length - 1
      ) {
        transactions = [
          ...transactions.slice(0, i),
          transaction,
          ...transactions.slice(i),
        ];
        break;
      }
    }
  }

  Cookies.setCookie("transactions", JSON.stringify(transactions), 1);

  let next = document.getElementsByClassName("transaction-list")[0].children[i];
  next.parentNode.insertBefore(card, next);
};

const incomeOptions = Options.incomeCategories.map(
  (cat) => `<option value=${cat}>${cat}</option>`
);

const expenseOptions = Options.expenseCategories.map(
  (cat) => `<option value=${cat}>${cat}</option>`
);

document.getElementsByName("transaction-type").forEach((radioButton) => {
  radioButton.addEventListener(
    "click",
    () =>
      (document.getElementById("category").innerHTML =
        radioButton.id === "income" ? incomeOptions : expenseOptions)
  );
});

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
      throw "Invalid date input!";
  }

  transactionCards.innerHTML = "";
  transactions
    .filter(
      (transaction) => Date.parse(transaction.dateObj) > Date.parse(dateObj)
    )
    .forEach((transaction) =>
      transactionCards.appendChild(createCard(transaction))
    );
};

document.getElementById("select-time").addEventListener("change", timeFilter);
