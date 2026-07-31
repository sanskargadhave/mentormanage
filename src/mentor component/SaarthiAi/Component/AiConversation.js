import "./AiConversation.css";
import AiChatInput from "./AiChatInput";
import AiAvtar from "./AiAvtar";
import AiMessage from "./AiMessage";

function AiConversation() {


    return (

        <div className="ai-conversation">

            <div className="conversation-body">

                <div className="message-row ai">
                    
                    <AiMessage type="ai" message="Hello Mentor! How can I help you today?" time="10:30 AM"/>
                </div>

            </div>

            <AiChatInput/>
        </div>

    );

}

export default AiConversation;