import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../state/user/userSlice";
import { useDispatch } from "react-redux";

const Signup = () => {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      const response = await axios.post("http://localhost:3000/signup", {
        name,
        email,
        password,
      });

      dispatch(login({ _id: response.data._id, name: name }));
      navigate("/home");
    } catch (e) {
      setError(e.response.data);
    }
  };

  return (
    <div className="flex h-full w-full justify-center items-center">
      <div className="flex flex-col h-96 w-72 bg-gray-500 items-center justify-between">
        <h1 className="pt-5 text-2xl">Sign Up</h1>
        <h2 className="text-red-700">{error}</h2>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <input placeholder="Name" type="text" required></input>
          <input placeholder="Email" type="email" required></input>
          <input placeholder="Password" type="password" required></input>
          <button>Sign up</button>
        </form>
        <h2 className="flex flex-col pb-5">
          Already have an account? <br></br>
          <button>
            <Link to={"/"}>Log In</Link>
          </button>
        </h2>
      </div>
    </div>
  );
};

export default Signup;
