import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const transactions = useSelector((state) => state.transaction.value);
  let balance = 0;
  let income = 0;
  let expense = 0;

  transactions.forEach((transaction) => {
    transaction.type === "income"
      ? (balance += transaction.amount)
      : (balance -= transaction.amount);

    transaction.type === "income"
      ? (income += transaction.amount)
      : (expense -= transaction.amount);
  });

  return (
    <div>
      <div className="flex gap-5 h-28 justify-center">
        <div className="bg-white rounded-2xl w-72 p-3">
          Total Income
          <br />
          <br />
          {income}
        </div>
        <div className="bg-white rounded-2xl w-72 p-3">
          Total Expenses
          <br />
          <br />
          {expense}
        </div>
        <div className="bg-white rounded-2xl w-72 p-3">
          Total Balance
          <br />
          <br />
          {balance}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
