import React from "react";
import { del } from "../state/transaction/transactionSlice";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";

const IncomeTransaction = ({ UID, date, amount, category, note }) => {
  const transactions = useSelector((state) => state.transaction.value);
  const dispatch = useDispatch();
  const handleDelete = () => {
    dispatch(del(UID));
    console.log(transactions.filter((transaction) => transaction.UID !== UID));
  };

  return (
    <div className="flex w-full h-20 bg-gray-500 justify-between rounded-3xl p-5">
      <h1 className="self-center">
        title
        <div>
          {amount} {date} {category} {note}
        </div>
      </h1>
      <button onClick={handleDelete}>
        <DeleteIcon />
      </button>
    </div>
  );
};

export default IncomeTransaction;
