import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import apiList from "../lib/apiList";

const CHAT_URL = `${apiList.resumeChecker.replace("/api/resume-checker", "")}/api/chat`;

const styles = {
    fab: {
        position: "fixed",
        bottom: 28,
        right: 28,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #6c63ff, #4f46e5)",
        border: "none",
        color: "#fff",
        fontSize: 26,
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(108,99,255,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.2s",
    },
    window: {
        position: "fixed",
        bottom: 96,
        right: 28,
        width: 360,
        maxHeight: 520,
        display: "flex",
        flexDirection: "column",
        background: "#1e1e2e",
        borderRadius: 16,
        boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        zIndex: 1000,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
    },
    header: {
        padding: "14px 18px",
        background: "linear-gradient(135deg, #6c63ff, #4f46e5)",
        color: "#fff",
        fontWeight: 700,
        fontSize: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    messages: {
        flex: 1,
        overflowY: "auto",
        padding: "14px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    bubble: (isUser) => ({
        maxWidth: "82%",
        alignSelf: isUser ? "flex-end" : "flex-start",
        background: isUser
            ? "linear-gradient(135deg, #6c63ff, #4f46e5)"
            : "rgba(255,255,255,0.07)",
        color: "#e2e8f0",
        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        padding: "10px 14px",
        fontSize: 14,
        lineHeight: 1.5,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
    }),
    typingDot: {
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: "#94a3b8",
        margin: "0 2px",
        animation: "bounce 1.2s infinite",
    },
    inputRow: {
        display: "flex",
        gap: 8,
        padding: "10px 12px",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        background: "#181825",
    },
    input: {
        flex: 1,
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 10,
        color: "#e2e8f0",
        padding: "8px 12px",
        fontSize: 14,
        outline: "none",
    },
    sendBtn: {
        background: "linear-gradient(135deg, #6c63ff, #4f46e5)",
        border: "none",
        borderRadius: 10,
        color: "#fff",
        padding: "8px 14px",
        cursor: "pointer",
        fontSize: 18,
        display: "flex",
        alignItems: "center",
    },
};

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "model", text: "Hi! 👋 I'm the Job Portal Assistant. Ask me anything about jobs, applications, or how the portal works!" },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        const userMsg = { role: "user", text };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const history = [...messages, userMsg].filter((m) => m.role !== "model" || m !== messages[0]);
            const res = await axios.post(CHAT_URL, {
                message: text,
                history: history.slice(-10), // send last 10 turns
            });
            setMessages((prev) => [...prev, { role: "model", text: res.data.reply }]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "model", text: "Sorry, I couldn't connect to the server. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>

            {/* Chat window */}
            {open && (
                <div style={styles.window}>
                    <div style={styles.header}>
                        <span>🤖 Job Portal Assistant</span>
                        <button
                            onClick={() => setOpen(false)}
                            style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 18 }}
                        >
                            ✕
                        </button>
                    </div>

                    <div style={styles.messages}>
                        {messages.map((msg, i) => (
                            <div key={i} style={styles.bubble(msg.role === "user")}>
                                {msg.text}
                            </div>
                        ))}
                        {loading && (
                            <div style={styles.bubble(false)}>
                                <span style={styles.typingDot} />
                                <span style={{ ...styles.typingDot, animationDelay: "0.2s" }} />
                                <span style={{ ...styles.typingDot, animationDelay: "0.4s" }} />
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <div style={styles.inputRow}>
                        <input
                            style={styles.input}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything..."
                            disabled={loading}
                        />
                        <button style={styles.sendBtn} onClick={sendMessage} disabled={loading}>
                            ➤
                        </button>
                    </div>
                </div>
            )}

            {/* Floating action button */}
            <button style={styles.fab} onClick={() => setOpen((o) => !o)} title="Job Portal Assistant">
                {open ? "✕" : "💬"}
            </button>
        </>
    );
}
