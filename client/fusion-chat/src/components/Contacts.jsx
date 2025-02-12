import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.svg";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  useEffect(() => {
    const fetchData = async () => {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
    };
    fetchData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && (
        <div className="flex flex-col h-full bg-gray-900 text-white overflow-hidden">
          <div className="flex items-center justify-center gap-4 py-4">
            <img src={Logo} alt="logo" className="h-8" />
            <h3 className="uppercase">snappy</h3>
          </div>
          <div className="flex flex-col items-center overflow-auto gap-2 flex-1 p-2">
            {contacts.map((contact, index) => (
              <div
                key={contact._id}
                className={`flex items-center gap-4 p-2 rounded-md cursor-pointer transition-colors w-11/12 ${index === currentSelected ? "bg-purple-500" : "bg-gray-700"}`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="" className="h-12" />
                <h3>{contact.username}</h3>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 bg-gray-800 py-4">
            <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" className="h-16" />
            <h2>{currentUserName}</h2>
          </div>
        </div>
      )}
    </>
  );
}
