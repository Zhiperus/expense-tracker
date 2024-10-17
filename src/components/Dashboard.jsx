import React from "react";

const Dashboard = () => {
  return (
    <div>
      <div className="flex gap-5 h-28 justify-center">
        <div className="bg-white rounded-2xl w-72 p-3">Total Income</div>
        <div className="bg-white rounded-2xl w-72 p-3">Total Expenses</div>
        <div className="bg-white rounded-2xl w-72 p-3">Total Balance</div>
      </div>
    </div>
  );
};

export default Dashboard;
