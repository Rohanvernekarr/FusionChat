import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
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
  const [showContacts, setShowContacts] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);

      if (!storedUser) {
        navigate("/login");
      } else {
        try {
          const userData = JSON.parse(storedUser);
          if (userData?.username) {
            setCurrentUser(userData);
          } else {
            navigate("/login");
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          navigate("/login");
        }
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
        try {
          const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data);
        } catch (error) {
          console.error("Error fetching contacts:", error);
          navigate("/login");
        }
      }
    };

    fetchContacts();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    setShowContacts(false);
  };

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-gradient-to-b from-gray-900 to-blue-900 p-2 md:p-4">
      <div className="w-full max-w-7xl h-[85vh] bg-black/60 rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden ring-1 ring-gray-700/30 backdrop-blur-sm">
        {/* Mobile Header */}
        <div className="flex items-center justify-between bg-gray-800 p-3 md:hidden">
          <button
            className="text-white focus:outline-none"
            onClick={() => setShowContacts(!showContacts)}
          >
            ☰
          </button>
          <h2 className="text-white text-lg font-semibold">Fusion Chat</h2>
        </div>

        {/* Contacts Sidebar */}
        <div className={`bg-gray-900 md:w-[300px] p-4 border-r border-gray-700/50 ${showContacts ? "absolute inset-0 z-50" : "hidden md:block"}`}>
          <Contacts contacts={contacts} changeChat={handleChatChange} />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full">
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-gray-400 mt-4  text-center text-sm">
        © {new Date().getFullYear()} Fusion Chat. Made with ❤️ by{" "}
        <a
          href="https://x.com/Rohanvrnkr?s=09"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition-colors"
        >
          Rohan
        </a>
      </footer>
    </div>
  );
}
