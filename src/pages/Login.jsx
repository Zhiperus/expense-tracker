import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { json, Link, Navigate, useNavigate } from "react-router-dom";
import { login } from "../state/user/userSlice";
import { set } from "../state/transaction/transactionSlice";

const Login = () => {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;
    var response;

    try {
      response = await axios.get("http://localhost:3000", {
        params: {
          email: email,
          password: password,
        },
      });

      dispatch(login({ _id: response.data._id, name: response.data.name }));
      dispatch(set(response.data.transactions));
      navigate("/home");
    } catch (e) {
      setError(e.response.data);
    }
  };

  return (
    <div className="flex h-full w-full justify-center items-center">
      <div className="flex flex-col h-96 w-72 bg-gray-500 items-center justify-between">
        <h1 className="pt-5 text-2xl">Log In</h1>
        <h2 className="text-red-700">{error}</h2>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <input placeholder="Email" type="email" required></input>
          <input placeholder="Password" type="password" required></input>
          <button>Log In</button>
        </form>
        <h2 className="flex flex-col pb-5">
          Create an account? <br></br>
          <button>
            <Link to={"/signup"}>Sign Up</Link>
          </button>
        </h2>
      </div>
    </div>
  );
};

export default Login;
