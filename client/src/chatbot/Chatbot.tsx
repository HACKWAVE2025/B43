import React, { useState } from "react";
import { getOpenAIResponse } from "./chatbotService";
import "./chatbot.css";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const botReply = await getOpenAIResponse(input);
    setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
  };

  return (
    <>
      <button className="chatbot-toggle nb-button" onClick={() => setIsOpen(!isOpen)}>
        💬 Chat
      </button>

      {isOpen && (
        <div className="chatbot-popup nb-card nb-card-lavender">
          <div className="chatbot-header">
            <h3 className="nb-heading">Vishuddhi Assistant</h3>
            <button className="nb-button" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              className="nb-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask Vishuddhi anything..."
            />
            <button className="nb-button" onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
