import React from "react";
import { useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import axios from "axios";
import { logoutRoute } from "../utils/ApiRoutes";

export default function Logout() {
  const navigate = useNavigate();

  const handleClick = async () => {
    const id = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))?._id;
    if (!id) return;

    const { status } = await axios.get(`${logoutRoute}/${id}`);
    if (status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex justify-center items-center p-2 rounded-md bg-gray-500 hover:bg-gray-600 transition duration-200"
    >
      <BiLogOut  className="text-xl text-white" />
    </button>
  );
}
