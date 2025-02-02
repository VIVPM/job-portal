// Chatbot.jsx
import { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const chatBodyRef = useRef(null);

    const API_KEY = "AIzaSyAOMP75rEoqkJYUibWQI_fz5jubbi2FW-E";
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Create a new user message
        const newMessage = {
            text: inputMessage,
            isBot: false,
            timestamp: new Date().toISOString()
        };

        // Update messages state immediately so that the UI shows the new message
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInputMessage('');
        setIsThinking(true);

        // Build the conversation history for context.
        // Each message is mapped to the format expected by the API:
        // - User messages get the "user" role.
        // - Bot messages get the "assistant" role.
        const conversationHistory = updatedMessages.map((msg) => ({
            role: msg.isBot ? "assistant" : "user",
            parts: [{ text: msg.text }]
        }));

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: conversationHistory
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error.message);

            // Extract and clean the bot's reply from the API response.
            const botMessage = {
                text: data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim(),
                isBot: true,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            setMessages(prev => [...prev, {
                text: error.message,
                isBot: true,
                isError: true,
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsThinking(false);
        }
    };

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    return (
        <div className={`chatbot-container ${isOpen ? 'show-chatbot' : ''}`}>
            <button
                className="chatbot-toggler"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="material-symbols-rounded">mode_comment</span>
                <span className="material-symbols-rounded">close</span>
            </button>

            <div className="chatbot-popup">
                <div className="chat-header">
                    <div className="header-info">
                        <svg className="chatbot-logo" viewBox="0 0 1024 1024">
                            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z" />
                        </svg>
                        <h2 className="logo-text">Chatbot</h2>
                    </div>
                    <button
                        className="close-chatbot material-symbols-rounded"
                        onClick={() => setIsOpen(false)}
                    >
                        keyboard_arrow_down
                    </button>
                </div>

                <div className="chat-body" ref={chatBodyRef}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`message ${message.isBot ? 'bot-message' : 'user-message'}`}
                        >
                            {message.isBot && (
                                <svg className="bot-avatar" viewBox="0 0 1024 1024">
                                    <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z" />
                                </svg>
                            )}
                            <div className={`message-text ${message.isError ? 'error' : ''}`}>
                                {message.text}
                                {message.isBot && isThinking && (
                                    <div className="thinking-indicator">
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <form className="chat-footer" onSubmit={handleSendMessage}>
                    <div className="chat-form">
                        <textarea
                            className="message-input"
                            placeholder="Message..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    handleSendMessage(e);
                                }
                            }}
                        />
                        <button
                            type="submit"
                            className="send-button material-symbols-rounded"
                            disabled={!inputMessage.trim()}
                        >
                            arrow_upward
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
