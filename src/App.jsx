import { useState } from "react";
import Dashboard from "./components/Dashboard";
import NavBar from "./components/NavBar";
import Expenses from "./components/Expenses";
import Incomes from "./components/Incomes";
import Transactions from "./components/Transactions";
import { useSelector } from "react-redux";
function App() {
  const navigate = useSelector((state) => state.navigation.value);

  return (
    <div className="h-screen w-screen">
      <div className="flex p-5 h-full gap-x-16">
        <div className="flex-1/4 h-full w-1/5 bg-gray-400 rounded-[35px]">
          <NavBar />
        </div>
        <div className="flex-auto h-full bg-gray-300 rounded-[35px]">
          <div className="p-5 h-full">
            {navigate[0] ? <Dashboard /> : ""}
            {navigate[1] ? <Transactions /> : ""}
            {navigate[2] ? <Incomes /> : ""}
            {navigate[3] ? <Expenses /> : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
