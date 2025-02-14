import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Logo from "../assets/fusionchat.png";
import { registerRoute } from "../utils/ApiRoutes";
import { useNavigate } from "react-router-dom";

function Register() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleValidation = () => {
    const { username, password, confirmPassword } = values;

    if (!username?.trim()) {
      toast.error("Username is required.", toastOptions);
      return false;
    }

    if (username.length < 3) {
      toast.error("Username must be at least 3 characters long.", toastOptions);
      return false;
    }

    if (password.length < 8) {
      toast.error(
        "Password must be at least 8 characters long.",
        toastOptions
      );
      return false;
    }

    if (!/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
      toast.error(
        "Password must include at least one number and one special character.",
        toastOptions
      );
      return false;
    }

    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should match.",
        toastOptions
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!handleValidation()) {
      return;
    }

    try {
      setLoading(true);
      const { username, email, password } = values;
      
      if (!username || !email || !password) {
        throw new Error("Please fill in all required fields");
      }

      const response = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      const { data } = response;

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
        return;
      }

      if (data.status === true && data.user) {
        localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify(data.user));
        navigate("/");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.msg || error.message || "Registration failed",
        toastOptions
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-blue-900">
      
      <div className=" bg-gray-900 p-8 rounded-lg shadow-md transition-transform duration-300 ease-in-out  hover:shadow-2xl w-full max-w-md">
 
        <div className="flex justify-center gap-4 items-center mb-6">
               <img src={Logo} alt="logo" className="h-8" />
                 <h1 className="text-2xl font-bold text-gray-300 uppercase">Fusion <span className="text-blue-500  ">Chat</span> </h1>
               </div>
        <form className="flex flex-col" onSubmit={handleSubmit}>
        <input
  type="text"
  name="username"
  placeholder="Username"
  value={values.username}
  onChange={handleChange}
  required
  className="custom-selection p-3 mb-4 border-b border-gray-500 bg-richblack rounded-md focus:outline-none hover:shadow-2xl transition duration-200 focus:ring-2 focus:ring-gray-500"
/>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
            required
            className="custom-selection p-3 mb-4 border-b border-gray-500 bg-richblack rounded-md focus:outline-none hover:shadow-2xl transition duration-200 focus:ring-2 focus:ring-gray-500"
          />
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              required
              className="p-3 w-full border-b bg-richblack text-White border-gray-500 rounded-md focus:outline-none hover:shadow-2xl transition duration-200 focus:ring-2 focus:ring-gray-500"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-gray-500 hover:text-white transition duration-200"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="relative mb-6">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={values.confirmPassword}
              onChange={handleChange}
              required
              className="p-3 w-full border-b bg-richblack text-White border-gray-500 rounded-md focus:outline-none hover:shadow-2xl transition duration-200 focus:ring-2 focus:ring-gray-500"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-3 text-gray-500 hover:text-white transition duration-200"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="p-3 bg-blue-900 text-white font-semibold rounded-md hover:bg-blue-800 shadow-2xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-sm text-white text-center">
          Already have an account?{" "}
          <a href="/login" className="text-violet-400 hover:underline">
            Login
          </a>
        </p>
      </div>
      <ToastContainer />
      <br />
      <footer className="text-gray-400  mt-4 text-center">
    © {new Date().getFullYear()} Fusion Chat.
  </footer>
    </div>
  );
}

export default Register;