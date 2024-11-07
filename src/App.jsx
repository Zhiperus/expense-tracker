import { Navigate, Route, Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useSelector } from "react-redux";

function App() {
  const user = useSelector((state) => state.user.value.name);

  return (
    <div className="h-screen w-screen">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={user !== "" ? <Home /> : <Navigate replace to={"/"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
