import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/fusionchat.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/ApiRoutes";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const user = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
    
    if (user) {
      console.log("User already logged in, navigating to home.");
      navigate("/");
    } else {
      toast.error("login to continue", toastOptions);
      console.log("No user data found in localStorage");
    }
  }, []);
  

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (!username || !password) {
      toast.error("Username and Password are required.", toastOptions);
      return false;
    }
    return true;
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      console.log("Sending login request with:", values);
      
      const { data } = await axios.post(loginRoute, values, {
        withCredentials: true,
      });

      console.log("Login response:", data);

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      } else {
        localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify(data.user));

        console.log("User saved in localStorage:", localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
        
        navigate("/");
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please try again.", toastOptions);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-blue-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md transition-transform duration-300 ease-in-out hover:shadow-2xl">
        <div className="flex justify-center gap-4 items-center mb-6">
          <img src={Logo} alt="Fusion Chat Logo" className="h-8" />
          <h1 className="text-2xl font-bold text-gray-300 uppercase">
            Fusion <span className="text-blue-500">Chat</span>
          </h1>
        </div>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            className="p-3 mb-4 border-b border-gray-500 bg-gray-900 rounded-md focus:outline-none hover:shadow-2xl transition duration-200 focus:ring-2 focus:ring-gray-500"
          />
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              required
              className="p-3 w-full border-b bg-gray-900 text-white border-gray-500 rounded-md focus:outline-none hover:shadow-2xl transition duration-200 focus:ring-2 focus:ring-gray-500"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-gray-500 hover:text-white transition duration-200"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="p-3 bg-blue-900 text-white font-semibold rounded-md hover:bg-blue-800 shadow-2xl transition duration-200"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-sm text-white text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-violet-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
      <ToastContainer />
      <br />
      <footer className="text-gray-400 mt-5 text-center">
        © {new Date().getFullYear()} Fusion Chat.
      </footer>
    </div>
  );
}
