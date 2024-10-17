import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const transactions = useSelector((state) => state.transaction.value);
  let balance = 0;

  transactions.forEach((transaction) => {
    console.log(typeof transaction.amount);

    transaction.type === "income"
      ? (balance += transaction.amount)
      : (balance -= transaction.amount);
  });

  return (
    <div>
      <div className="flex gap-5 h-28 justify-center">
        <div className="bg-white rounded-2xl w-72 p-3">Total Income</div>
        <div className="bg-white rounded-2xl w-72 p-3">Total Expenses</div>
        <div className="bg-white rounded-2xl w-72 p-3">
          Total Balance {balance}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
