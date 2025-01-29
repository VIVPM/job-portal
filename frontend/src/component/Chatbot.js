import React, { useState, useEffect, useRef } from "react";
import "./Chatbox.css";
import userImage from "./15013685.png";
import botImage from "./chatbot.png";
const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatboxRef = useRef(null);
    const apiKey = "AIzaSyAOMP75rEoqkJYUibWQI_fz5jubbi2FW-E"; // Replace with your actual API key
    
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setTimeout(() => {
                setMessages([{ name: "Bot", message: "Hey there! How can I help you today? 😊" }]);
            }, 500);
        }
    }, [isOpen, messages.length]);

    const toggleChatbox = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = () => {
        if (!input.trim()) return;

        const userMessage = { name: "User", message: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput("");

        setTimeout(() => {
            const typingMessage = { name: "Bot", message: "Typing..." };
            setMessages((prevMessages) => [...prevMessages, typingMessage]);
            fetchChatbotResponse(input);
        }, 500);
    };

    const fetchChatbotResponse = async (userMessage) => {
        const data = {
            contents: [{ parts: [{ text: userMessage }] }],
        };

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            );
            const result = await response.json();

            const botResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't get a response. Please try again.";
            setMessages((prevMessages) => prevMessages.slice(0, -1).concat({ name: "Bot", message: botResponse }));
        } catch (error) {
            console.error("Error fetching chatbot response:", error);
            setMessages((prevMessages) => prevMessages.slice(0, -1).concat({ name: "Bot", message: "Sorry, something went wrong. Try again later." }));
        }
    };

    return (
        <div>
            <div className="chatbox__icon" onClick={toggleChatbox}>
                💬
            </div>

            <div className={`chatbox ${isOpen ? "active" : ""}`} ref={chatboxRef}>
                    <div className="chatbox__support">
                        <div className="chatbox__header">
                            <img src={botImage} alt="Chatbot" />
                            <div className="chatbot-title">Chatbot</div>
                            <div className="chatbox__close" onClick={toggleChatbox}>✖</div>
                        </div>
                        <div className="chatbox__messages">
                        {messages.slice().reverse().map((msg, index) => (
                            <div key={index} className={msg.name === "User" ? "messages__item messages__item--operator" : "messages__item messages__item--visitor"}>
                                <img src={msg.name === "User" ? userImage : botImage} alt={msg.name} />
                                {msg.message}
                            </div>
                        ))}
                        </div>
                        <div className="chatbox__footer">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            />
                            <button className="chatbox__send--footer" onClick={handleSendMessage}>Send</button>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default Chatbot;
