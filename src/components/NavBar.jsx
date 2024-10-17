import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTab } from "../state/navigation/navigationSlice";

const NavBar = () => {
  const navigate = useSelector((state) => state.navigation.value);
  const dispatch = useDispatch();

  return (
    <div className="p-8 h-full">
      NavBar
      <div className="flex h-20 w-full">
        <img
          className="mr-6 w-20 rounded-full overflow-hidden"
          src="data:image/webp;base64,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"
        />
        <div>
          <h2 className="font-bold text-lg">Name</h2>
          <h2>Summary</h2> {/* changes depending on clicked paged */}
        </div>
      </div>
      <div className="flex flex-col mt-10 h-full gap-3 items-start">
        <input
          type="button"
          value="Dashboard"
          className={`cursor-pointer ${
            navigate[0] ? "pl-5 border-l-4 border-indigo-500" : ""
          }`}
          onClick={() => dispatch(changeTab(1))}
        />
        <input
          type="button"
          value="View Transactions"
          className={`cursor-pointer ${
            navigate[1] ? "pl-5 border-l-4 border-indigo-500" : ""
          }`}
          onClick={() => dispatch(changeTab(2))}
        />
        <input
          type="button"
          value="Incomes"
          className={`cursor-pointer ${
            navigate[2] ? "pl-5 border-l-4 border-indigo-500" : ""
          }`}
          onClick={() => dispatch(changeTab(3))}
        />
        <input
          type="button"
          value="Expenses"
          className={`cursor-pointer ${
            navigate[3] ? "pl-5 border-l-4 border-indigo-500" : ""
          }`}
          onClick={() => dispatch(changeTab(4))}
        />
      </div>
    </div>
  );
};

export default NavBar;
