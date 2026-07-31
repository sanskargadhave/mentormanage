import "./AiHeader.css";
import AiAvtar from "./AiAvtar";
function AiHeader() {

    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    return (

        <header className="ai-header">

            {/* Left */}

            <div className="ai-header-left">

                <div className="ai-logo">

                    <div className="ai-logo-icon">

                        🕸️

                    </div>

                    <div>

                        <h2>Saarthi AI</h2>

                        <span>Your Academic Intelligence Assistant</span>

                    </div>

                </div>

            </div>

            {/* Center */}

            <div className="ai-header-center">

                <div className="ai-status">

                    <span className="status-dot"></span>

                    Online

                </div>

                <div className="header-date">

                    📅 {today}

                </div>

            </div>

            {/* Right */}

            <div className="ai-header-right">

                <button className="header-btn">

                    <i className="bi bi-plus-circle"></i>

                    <span>New Chat</span>

                </button>

                <button className="header-icon">

                    <i className="bi bi-bell"></i>

                </button>

                <button className="header-icon">

                    <i className="bi bi-gear"></i>

                </button>

                <div className="mentor-profile">

                    <img
                        src="https://i.pravatar.cc/100"
                        alt="Mentor"
                    />

                    <div>

                        <h4>Mentor</h4>

                        <span>Online</span>

                    </div>

                </div>

            </div>

        </header>

    );

}

export default AiHeader;