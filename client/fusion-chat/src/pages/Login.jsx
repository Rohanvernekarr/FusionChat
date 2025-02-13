import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/ApiRoutes"; // Corrected case

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "" || password === "") {
      toast.error("Username and Password are required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, { username, password });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-richblack">
      <div className="bg-richblack p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold text-white uppercase">Login</h1>
        </div>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            className="p-3 mb-4 border-b border-gray-500 text-White bg-richblack rounded-md focus:outline-none hover:shadow-2xl transition duration-200 focus:ring-2 focus:ring-gray-500"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            className="p-3 mb-4 border-b border-gray-500 text-White bg-richblack rounded-md focus:outline-none hover:shadow-2xl transition duration-200 focus:ring-2 focus:ring-gray-500"
          />
          <button
            type="submit"
            className="p-3 bg-black text-white font-semibold rounded-md hover:bg-Black shadow-2xl transition duration-200"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-sm text-white text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-gray-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}
