const transactions = [];

document.getElementsByTagName("form")[0].onsubmit = (e) => {
  e.preventDefault();
  const form = e.target;
  const [h, m] = form.time.value.split(":");
  const [year, month, day] = form.date.value.split("-");
  const dateObj = new Date(year, month - 1, day);
  const [dayStr, monthStr, dayOfMonth, yearStr] = dateObj
    .toDateString()
    .split(" ");

  const transaction = {
    type: form.income.checked === true ? "income" : "expense",
    date: `${monthStr} ${dayOfMonth}, ${yearStr}`,
    time: `${h % 12 ? h % 12 : 12}:${m} ${h >= 12 ? "PM" : "AM"}`,
    amount:
      form.income.checked === true ? +form.amount.value : -form.amount.value,
    category: form.category.value,
    account: form.account.value,
    note: form.note.value,
  };

  console.log(transaction);
};
