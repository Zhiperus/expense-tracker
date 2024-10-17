import React from "react";
import { del } from "../state/transaction/transactionSlice";
import { useDispatch, useSelector } from "react-redux";

const IncomeTransaction = ({ UID, date, amount, category, note }) => {
  const transactions = useSelector((state) => state.transaction.value);
  const dispatch = useDispatch();
  const handleDelete = () => {
    dispatch(del(UID));
    console.log(transactions.filter((transaction) => transaction.UID !== UID));
  };

  return (
    <div>
      <h1>
        {date} {amount} {category} {note}
      </h1>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default IncomeTransaction;
