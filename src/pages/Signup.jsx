import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="flex h-full w-full justify-center items-center">
      <div className="flex flex-col h-96 w-72 bg-gray-500 items-center">
        <h1 className="mt-5 text-2xl">Sign Up</h1>
        <form className="flex flex-col gap-5 p-5 mt-16">
          <input placeholder="Name" type="text"></input>
          <input placeholder="Email" type="email"></input>
          <input placeholder="Password" type="password"></input>
          <button>Sign up</button>
        </form>
        <h2 className="flex flex-col mt-4">
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
