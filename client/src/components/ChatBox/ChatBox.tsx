import React, { useState } from "react";
import styles from "./chatBox.module.scss";
import { LuChevronRight, LuMic } from "react-icons/lu";

const ChatBox: React.FC = () => {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("http://localhost:3001/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });
            const data = await res.json();
            setResponse(data.reply);
        } catch (err) {
            setResponse("Ошибка при получении ответа.");
        } finally {
            setLoading(false);
        }
    };

    const handleVoiceInput = () => {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = "ru-RU";
        recognition.start();
        recognition.onresult = (event: any) => {
            setInput(event.results[0][0].transcript);
        };
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Hi there!</h1>
            <p className={styles.subheading}>What would you like to know?</p>
            <div className={styles.inputWrapper}>
                <span className={styles.icon} onClick={handleVoiceInput}>
                    <LuMic size={24} style={{ background: "none" }} />
                </span>

                <input
                    className={styles.input}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask whatever you want"
                />

                <button className={styles.sendButton} onClick={handleSend}>
                    <LuChevronRight size={25} style={{ background: "none", scale: '1.3' }} />
                </button>
            </div>
            {loading && <div className={styles.loader}></div>}
            {loading && <p className={styles.loadingText}>Loading...</p>}
            {response && <div className={styles.response}>{response}</div>}
        </div>
    );
};

export default ChatBox;
