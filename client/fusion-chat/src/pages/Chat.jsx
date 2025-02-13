import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io  from "socket.io-client";
import { allUsersRoute, host } from "../utils/ApiRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if (!storedUser) {
        navigate("/login");
      } else {
        setCurrentUser(JSON.parse(storedUser));
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {      
          const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data);
        } else {
          navigate("/");
        }
      
    };

    fetchContacts();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-gradient-to-b from-gray-900 to-blue-900 p-4">
  <div className="w-full max-w-7xl h-[85vh] bg-black/60 rounded-xl shadow-2xl grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[380px_1fr] overflow-hidden ring-1 ring-gray-700/30">
    <Contacts contacts={contacts} changeChat={handleChatChange} />
    {currentChat === undefined ? <Welcome /> : <ChatContainer currentChat={currentChat} socket={socket} />}
  </div>
  <footer className="text-gray-400 mt-4 text-center">
  © {new Date().getFullYear()} Fusion Chat. All rights reserved. Unauthorized reproduction or distribution is strictly prohibited.
</footer>

</div>

  );
}
