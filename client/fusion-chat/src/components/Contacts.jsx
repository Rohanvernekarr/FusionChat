import React, { useState, useEffect } from "react";
import Logo from "../assets/fusionchat.png";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentSelected, setCurrentSelected] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const storedData = await localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);

      if (!storedData) {
        console.error("No user data found in localStorage");
        return;
      }

      try {
        const data = JSON.parse(storedData);
        if (data?.username) {
          setCurrentUserName(data.username);
        } else {
          console.error("Invalid user data format:", data);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    };

    fetchData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserName && (
        <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-center gap-4 py-6 bg-gray-800/70 backdrop-blur-sm border-b border-gray-700/50">
            <img src={Logo} alt="logo" className="h-10" />
            <h3 className="uppercase text-2xl font-bold text-blue-400">Fusion Chat</h3>
          </div>

          {/* Contact List */}
          <div className="flex flex-col items-center overflow-auto gap-2 flex-1 p-4">
            {contacts.map((contact, index) => (
              <div
                key={contact._id}
                className={`flex items-center gap-4 p-3 rounded-lg text-lg pl-4 cursor-pointer hover:bg-gray-700/50 transition-all w-full
                   ${index === currentSelected ? "bg-gray-700/70 shadow-lg" : "bg-gray-800/50"}`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                  {contact.username.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-medium">{contact.username}</h3>
              </div>
            ))}
          </div>

          {/* Current User */}
          <div className="flex items-center justify-center gap-4 bg-gray-800/70 backdrop-blur-sm py-4 border-t border-gray-700/50">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
              {currentUserName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-lg font-semibold">{currentUserName}</h2>
          </div>
        </div>
      )}
    </>
  );
}