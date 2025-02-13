/*

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/ApiRoutes";
import loader from "../assets/loader.gif";

export default function SetAvatar() {
  const api = "https://api.multiavatar.com";
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const avatarPromises = Array.from({ length: 4 }, async (_, index) => {
          const avatarId = `User_${index}_${Date.now()}`; // Unique string-based ID
          const response = await fetch(`https://api.multiavatar.com/${JSON.stringify(avatarId)}`);
          if (!response.ok) throw new Error("Failed to fetch avatar");
          const svgText = await response.text();
          return btoa(svgText); // Convert SVG to Base64
        });
  
        const avatarsData = await Promise.all(avatarPromises);
        setAvatars(avatarsData);
      } catch (error) {
        toast.error("Failed to load avatars", toastOptions);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAvatars();
  }, []);
  

  const setProfilePicture = async () => {
    if (selectedAvatar === null) {
      return toast.error("Please select an avatar", toastOptions);
    }

    const user = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    const response = await fetch(`${setAvatarRoute}/${user._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: avatars[selectedAvatar] }),
    });

    const data = await response.json();

    if (data.isSet) {
      user.isAvatarImageSet = true;
      user.avatarImage = data.image;
      localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify(user));
      navigate("/");
    } else {
      toast.error("Error setting avatar. Please try again.", toastOptions);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex h-screen items-center justify-center bg-gray-900">
          <img src={loader} alt="Loading..." className="w-20" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
          <h1 className="text-xl font-semibold mb-6">Pick an Avatar</h1>
          <div className="flex gap-6">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`p-2 rounded-full cursor-pointer transition ${
                  selectedAvatar === index ? "border-4 border-blue-500" : "border-4 border-transparent"
                }`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full"
                />
              </div>
            ))}
          </div>
          <button
            onClick={setProfilePicture}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition"
          >
            Set as Profile Picture
          </button>
          <ToastContainer />
        </div>
      )}
    </>
  );
}
*/