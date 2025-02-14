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
        <div className="flex flex-col h-full bg-gray-900 text-white overflow-hidden">
          <div className="flex items-center justify-center gap-4 py-4">
            <img src={Logo} alt="logo" className="h-8" />
            <h3 className="uppercase">Fusion Chat</h3>
          </div>
          <div className="flex flex-col items-center overflow-auto gap-2 flex-1 p-2">
            {contacts.map((contact, index) => (
              <div
                key={contact._id}
                className={`flex items-center gap-4 p-3 rounded-lg text-xl pl-4 cursor-pointer hover:bg-gray-700 transition-colors w-11/12
                   ${index === currentSelected ? "bg-gray-600" : "bg-gray-800"}`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <h3>{contact.username} </h3>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 bg-gray-900 py-4">
            <h2>{currentUserName}</h2>
          </div>
        </div>
      )}
    </>
  );
}