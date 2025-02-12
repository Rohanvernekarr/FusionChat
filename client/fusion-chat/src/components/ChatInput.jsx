import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    setMsg((prev) => prev + emojiObject.emoji);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.trim().length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <div className="flex items-center bg-gray-800 p-4 rounded-lg">
      <div className="relative mr-4">
        <BsEmojiSmileFill 
          className="text-yellow-400 text-2xl cursor-pointer"
          onClick={handleEmojiPickerhideShow} 
        />
        {showEmojiPicker && (
          <div className="absolute bottom-full mb-2 bg-gray-900 shadow-lg border border-purple-500 rounded-lg">
            <Picker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
      <form onSubmit={sendChat} className="flex flex-1 items-center bg-gray-700 rounded-lg px-4 py-2">
        <input
          type="text"
          placeholder="Type your message here"
          className="flex-1 bg-transparent text-white border-none outline-none text-lg"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded-full flex items-center">
          <IoMdSend className="text-2xl" />
        </button>
      </form>
    </div>
  );
}
