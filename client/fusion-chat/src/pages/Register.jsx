import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="relative w-full max-w-md p-8 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 rounded-xl backdrop-blur-md border border-gray-800 shadow-[0_0_15px_rgba(88,_28,_255,_0.15)]">
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 w-full h-1 "></div>
        
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-700 text-center mb-8">
          Fusion Chat
        </h1>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={values.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-black/50 text-white rounded-lg border border-gray-800 
            placeholder-gray-500 focus:outline-none focus:border-gray-500 
            focus:ring-2 focus:ring-gray-500/20 transition-all duration-300
            hover:border-gray-700 hover:shadow-[0_0_10px_rgba(88,_28,_255,_0.1)]"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-black/50 text-white rounded-lg border border-gray-800 
            placeholder-gray-500 focus:outline-none focus:border-gray-500 
            focus:ring-2 focus:ring-gray-500/20 transition-all duration-300
            hover:border-gray-700 hover:shadow-[0_0_10px_rgba(88,_28,_255,_0.1)]"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-black/50 text-white rounded-lg border border-gray-800 
              placeholder-gray-500 focus:outline-none focus:border-gray-500 
              focus:ring-2 focus:ring-gray-500/20 transition-all duration-300
              hover:border-gray-700 hover:shadow-[0_0_10px_rgba(88,_28,_255,_0.1)]"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 
              hover:text-gray-400 focus:outline-none transition-colors duration-300"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={values.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-black/50 text-white rounded-lg border border-gray-800 
              placeholder-gray-500 focus:outline-none focus:border-gray-500 
              focus:ring-2 focus:ring-gray-500/20 transition-all duration-300
              hover:border-gray-700 hover:shadow-[0_0_10px_rgba(88,_28,_255,_0.1)]"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 
              hover:text-gray-400 focus:outline-none transition-colors duration-300"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white 
            rounded-lg font-semibold transition-all duration-300
            hover:shadow-[0_0_20px_rgba(88,_28,_255,_0.3)] 
            active:scale-[0.98] "
          >

            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-gray-400 text-center">
          Already have an account?{" "}
          <a 
            href="/login" 
            className="text-gray-400 hover:text-gray-300 transition-colors duration-300 
            hover:underline focus:outline-none focus:ring-2 focus:ring-gray-500/20"
          >
            Login
          </a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;