import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/ApiRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Set up socket connection for current user
  useEffect(() => {
    const setupSocket = async () => {
      if (socket.current) {
        const userData = await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        socket.current.emit("add-user", userData._id);
      }
    };
    setupSocket();
  }, [socket]);

  // Initial message fetch
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const userData = await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        const response = await axios.post(recieveMessageRoute, {
          from: userData._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    if (currentChat?._id) {
      fetchMessages();
      setHasNewMessage(false);
    }
  }, [currentChat]);

  // Socket message listener with proper cleanup
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (data) => {
        console.log("Received message:", data);
        setMessages((prev) => [...prev, {
          fromSelf: false,
          message: data.message,
          timestamp: data.timestamp
        }]);
        setHasNewMessage(true);
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off("msg-receive");
      }
    };
  }, []);

  const handleSendMsg = async (msg) => {
    try {
      const userData = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      const timestamp = new Date().toISOString();

      const messageData = {
        to: currentChat._id,
        from: userData._id,
        message: msg,
        timestamp,
      };

      // Emit message through socket
      socket.current.emit("send-msg", messageData);

      // Save message to database
      await axios.post(sendMessageRoute, {
        from: userData._id,
        to: currentChat._id,
        message: msg,
        timestamp,
      });

      // Update local messages state
      setMessages((prev) => [...prev, {
        fromSelf: true,
        message: msg,
        timestamp
      }]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex  flex-col h-full bg-gray-900 overflow-auto">
      <div className="flex  items-center justify-between p-4 bg-gray-800">
        <div className="flex items-center  gap-4">
          <div className="relative">
            <h3 className="text-white text-lg">{currentChat?.username}</h3>
            {hasNewMessage && (
              <span className="absolute -right-4 -top-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>
        </div>
        <Logout />
      </div>

      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-auto p-4 space-y-4 bg-gray-900">
          {messages.map((message) => (
            <div
              ref={scrollRef}
              key={uuidv4()}
              className={`flex ${
                message.fromSelf ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-sm px-4 py-2 rounded-lg text-white ${
                  message.fromSelf ? "bg-gray-600" : "bg-gray-600"
                }`}
              >
                <p>{message.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 p-2 bg-gray-800">
          <ChatInput handleSendMsg={handleSendMsg} />
        </div>
      </div>
    </div>
  );
}