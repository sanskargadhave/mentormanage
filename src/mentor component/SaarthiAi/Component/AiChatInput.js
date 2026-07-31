import { useState } from "react";
import "./AiChatInput.css";

function AiChatInput({ onSend }) {

    const [message, setMessage] = useState("");

    function handleSend() {

        if (!message.trim()) return;

        if (onSend) {
            onSend(message);
        }

        setMessage("");
    }

    function handleKeyDown(e) {

        if (e.key === "Enter" && !e.shiftKey) {

            e.preventDefault();

            handleSend();

        }

    }

    return (

        <div className="ai-chat-input">

           

            <textarea
                value={message}
                rows={1}
                placeholder="Ask Saarthi AI anything about your students..."
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
            />

                

            <button
                className="ai-send-btn"
                onClick={handleSend}
            >
                <i className="bi bi-send-fill"></i>
            </button>

        </div>

    );

}

export default AiChatInput;