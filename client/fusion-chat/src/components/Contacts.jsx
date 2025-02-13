import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.svg";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      console.log(data);
      
      setCurrentUserName(data.username);
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
                className={`flex items-center gap-4 p-2 rounded-md cursor-pointer transition-colors w-11/12 ${index === currentSelected ? "bg-purple-500" : "bg-gray-700"}`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <h3>{contact.username}</h3>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 bg-gray-800 py-4">
            <h2>{currentUserName}</h2>
          </div>
        </div>
      )}
    </>
  );
}
