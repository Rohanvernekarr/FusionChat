import React, { useState, useEffect } from "react";
import Robot from "../assets/robot.gif";

export default function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      const storedUser = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUserName(userData.username || "User");
      }
    };

    fetchUserName();
  }, []);

  return (
    <div className="flex flex-col items-center bg-gray-900 justify-center h-screen text-white text-center p-4">
      {/* Robot Image */}
      <img
        src={Robot}
        alt="Welcome Robot"
        className="h-40 md:h-60 mb-4"
      />

      {/* Welcome Message */}
      <h1 className="text-2xl md:text-3xl font-bold">
        Welcome, <span className="text-gray-300">{userName}!</span>
      </h1>

      {/* Instruction Text */}
      <h3 className="text-base md:text-lg mt-2">
        Please select a chat to start messaging.
      </h3>
    </div>
  );
}