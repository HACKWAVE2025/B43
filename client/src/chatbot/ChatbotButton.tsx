import React from "react";

interface ChatbotButtonProps {
  onClick: () => void;
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onClick }) => (
  <button className="chatbot-toggle nb-button" onClick={onClick}>
    💬 Chat
  </button>
);

export default ChatbotButton;
