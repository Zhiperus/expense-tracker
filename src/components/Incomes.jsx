import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { add, del } from "../state/transaction/transactionSlice";
import { v4 as uuid } from "uuid";
import IncomeTransaction from "./IncomeTransaction";

const Incomes = () => {
  const transactions = useSelector((state) => state.transaction.value);
  const dispatch = useDispatch();
  console.log(transactions);

  const handleSubmit = (event) => {
    event.preventDefault();
    const inputs = event.currentTarget.elements;
    const transaction = {
      UID: uuid(),
      type: "income",
      date: inputs.date.value,
      amount: parseInt(inputs.amount.value),
      category: inputs.category.value,
      note: inputs.note.value,
    };
    dispatch(add(transaction));
    event.target.reset();
  };

  return (
    <div>
      <div className="flex">
        <div className="flex flex-col w-1/4">
          Add Income
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 grid-rows-5 gap-3">
              <label htmlFor="date">Date </label>
              <input name="date" type="date" required />
              <label htmlFor="amount">Amount </label>
              <input name="amount" type="number" min="1" required />
              <label htmlFor="category">Category </label>
              <select name="category" required>
                <option value="" selected disabled hidden></option>
                <option value="allowance">Allowance</option>
                <option value="salary">Salary</option>
                <option value="petty cash">Petty Cash</option>
                <option value="other">Other</option>
              </select>
              <label htmlFor="note">Note </label>
              <input name="note" type="text" />
              <button type="submit">Add</button>
            </div>
          </form>
        </div>
        <div className="flex-auto">
          {transactions.length != 0 &&
            transactions.map((element) => {
              return element.type === "income" ? (
                <IncomeTransaction key={element.UID} {...element} />
              ) : (
                ""
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Incomes;
