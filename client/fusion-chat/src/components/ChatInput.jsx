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
    <div className="flex items-center bg-gray-800/70 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-700/50 shadow-lg">
      {/* Emoji Picker */}
      <div className="relative mr-3">
        <BsEmojiSmileFill
          className="text-yellow-400 text-2xl cursor-pointer hover:text-yellow-300 transition-colors"
          onClick={handleEmojiPickerhideShow}
        />
        {showEmojiPicker && (
          <div className="absolute bottom-full mb-2 bg-gray-900 shadow-lg border border-gray-700/50 rounded-lg">
            <Picker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={sendChat} className="flex flex-1 items-center bg-gray-700/50 rounded-lg px-4 py-2">
        <input
          type="text"
          placeholder="Type your message here..."
          className="flex-1 bg-transparent text-white border-none outline-none text-lg placeholder-gray-400"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <IoMdSend className="text-xl" />
        </button>
      </form>
    </div>
  );
}