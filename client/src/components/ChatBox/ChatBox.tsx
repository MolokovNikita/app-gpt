import React, { useEffect, useState } from "react";
import styles from "./chatBox.module.scss";
import { LuChevronRight, LuMic, LuMessageCircle } from "react-icons/lu";

interface ApiResponse {
    reply: string;
    model?: string;
    error?: string;
}

const ChatBox: React.FC = () => {
    const [input, setInput] = useState<string>("");
    const [response, setResponse] = useState<string>("");
    const [fullResponse, setFullResponse] = useState<string>("");
    const [model, setModel] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [_, setCurrentIndex] = useState<number>(0);

    const API_URL = import.meta.env.VITE_API_URL;


    useEffect(() => {
        if (loading || !fullResponse) return;

        setCurrentIndex(0);
        setResponse("");

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex: number) => {
                if (prevIndex >= fullResponse.length) {
                    clearInterval(interval);
                    return prevIndex;
                }
                setResponse(fullResponse.slice(0, prevIndex + 1));
                return prevIndex + 1;
            });
        }, 25);

        return () => clearInterval(interval);
    }, [loading, fullResponse]);

    const handleSend = async () => {

        if (!input.trim()) return;

        setLoading(true);
        setError("");
        setResponse("");
        setFullResponse("");
        setModel("");

        try {
            const res = await fetch(`${API_URL}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            const data: ApiResponse = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Ошибка сервера");
            }

            if (!data.reply) {
                throw new Error("Пустой ответ от сервера");
            }

            setFullResponse(data.reply);
            setModel(data.model || "Неизвестная модель");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Неизвестная ошибка");
            setFullResponse("");
        } finally {
            setLoading(false);
        }
    };

    const handleVoiceInput = () => {
        if (!("webkitSpeechRecognition" in window)) {
            setError("Голосовой ввод не поддерживается");
            return;
        }
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = "ru-RU";
        recognition.onresult = (event: SpeechRecognitionEvent) => {
            setInput(event.results[0][0].transcript);
        };
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            setError(`Ошибка распознавания: ${event.error}`);
        };
        recognition.start();
    };

    return (
        <div className={styles.container}>
            <div className={styles.messageCircle}>
                <LuMessageCircle size={24} style={{ background: "none" }} />
            </div>
            <h1 className={styles.heading}>Hi there!</h1>
            <p className={styles.subheading}>What would you like to know?</p>
            <p className={styles.askQuestion}>
                Use one of the most common prompts below or ask your own question
            </p>

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
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />

                <button
                    className={styles.sendButton}
                    onClick={handleSend}
                    disabled={loading}
                >
                    <LuChevronRight
                        size={25}
                        style={{
                            background: "none",
                            scale: "1.3",
                            opacity: loading ? 0.5 : 1,
                        }}
                    />
                </button>
            </div>

            {loading && (
                <div className={styles.skeleton}>
                    <div className={styles.skeletonLine}></div>
                    <div className={styles.skeletonLineShort}></div>
                </div>
            )}

            {error && <div className={styles.error}>{error}</div>}
            {response && (
                <div className={styles.responseContainer}>
                    <div className={styles.response}>{response}</div>
                </div>
            )}
            {model && (
                <span className={styles.modelBadge}>
                    Модель: {model}
                </span>
            )}
        </div>
    );
};

export default ChatBox;
