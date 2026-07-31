import "./SaarthiAi.css";

import AiAvtar from "./Component/AiAvtar";
import AiChatInput from "./Component/AiChatInput";
import AiConversation from "./Component/AiConversation";
import AiHeader from "./Component/AiHeader";
import AiMessage from "./Component/AiMessage";
import AiRightPanel from "./Component/AiRightPanel";
import AiSidebar from "./Component/AiSidebar";
import AlertCard from "./Component/AlertCard";
import QuickAction from "./Component/QuickAction";
import RecommendationChart from "./Component/RecommendationChart";
import StudentProfileCard from "./Component/StudentProfileCard";
import SuggestionCard from "./Component/SuggestionCard";
import TypingAnimation from "./Component/TypingAnimation";


function SaarthiAI() {

    return (

        <section className="saarthi-ai">

            {/* Header */}

            <AiHeader />

            {/* Main Body */}

            <div className="saarthi-body">

                {/* Left Sidebar */}

                <aside className="saarthi-sidebar">
                   
                    <AiSidebar />

                </aside>

                {/* Center Chat */}

                <main className="saarthi-conversation">
                    <AiConversation />
                    
                </main>

                {/* Right Insights */}

                <aside className="saarthi-right">

                    <AiRightPanel />

                </aside>

            </div>

        </section>

    );

}
export default SaarthiAI;