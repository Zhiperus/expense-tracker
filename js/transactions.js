import uuidv4 from "./utilities/UUID.js";

let transactions = [];

const delTransaction = (Id) => {
  const index = transactions.map((transaction) => transaction.Id).indexOf(Id);

  transactions.splice(index, 1);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  const transactionCards =
    document.getElementsByClassName("transaction-cards")[0];
  transactionCards.removeChild(transactionCards.children[index]);
};

const createCard = (transaction) => {
  let card = document.createElement("div");
  card.classList.add(`${transaction.type}-card`);
  card.innerHTML = `
  <div class="card-header">
    <span class="amount">
      ${transaction.type === "income" ? "+" : "-"}₱${Math.abs(
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

transactions = JSON.parse(localStorage.getItem("transactions"))
  ? JSON.parse(localStorage.getItem("transactions"))
  : [];

const transactionCards =
  document.getElementsByClassName("transaction-cards")[0];
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

    document.getElementsByClassName("transaction-cards")[0].appendChild(card);
  } else {
    for (; i < transactions.length; i++) {
      if (
        Number(transactions[i].dateObj) < Number(transaction.dateObj) ||
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

  localStorage.setItem("transactions", JSON.stringify(transactions));

  let next =
    document.getElementsByClassName("transaction-cards")[0].children[i];
  next.parentNode.insertBefore(card, next);
};
