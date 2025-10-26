import React, { useState } from "react";
import axios from "axios";

export default function ChatBot() {
  const [query, setQuery] = useState("");
  const [chat, setChat] = useState([]);

  const sendQuery = async () => {
    if (!query) return;
    setChat([...chat, { sender: "user", text: query }]);

    try {
      const res = await axios.post("http://localhost:5000/api/query", {
        text: query,
        lang: "en"
      });
      setChat((prev) => [...prev, { sender: "assistant", text: res.data.reply }]);
    } catch (err) {
      setChat((prev) => [...prev, { sender: "assistant", text: "Error contacting server." }]);
    }

    setQuery("");
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {chat.map((msg, idx) => (
          <div key={idx} className={msg.sender}>
            <b>{msg.sender}:</b> {msg.text}
          </div>
        ))}
      </div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type your query..."
      />
      <button onClick={sendQuery}>Send</button>
    </div>
  );
}
