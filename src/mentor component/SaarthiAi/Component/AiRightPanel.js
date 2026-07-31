import "./AiRightPanel.css";

function AiRightPanel() {

    return (

        <div className="ai-right-panel">

            {/* AI Status */}

            <div className="right-card">

                <div className="right-card-title">

                    🤖 Saarthi Status

                </div>

                <div className="status-box">

                    <div className="status-circle"></div>

                    <div>

                        <h4>Ready to Assist</h4>

                        <span>AI Engine Running</span>

                    </div>

                </div>

            </div>

            {/* AI Confidence */}

            <div className="right-card">

                <div className="right-card-title">

                    🎯 AI Confidence

                </div>

                <div className="confidence-score">

                    98%

                </div>

                <div className="confidence-progress">

                    <div className="confidence-fill"></div>

                </div>

                <small>
                    High confidence based on academic records.
                </small>

            </div>

            {/* Alerts */}

            <div className="right-card">

                <div className="right-card-title">

                    🚨 Today's Alerts

                </div>

                <ul className="alert-list">

                    <li>
                        12 students below 75%
                    </li>

                    <li>
                        5 leave applications pending
                    </li>

                    <li>
                        2 assignments overdue
                    </li>

                </ul>

            </div>

            {/* Quick Actions */}

            <div className="right-card">

                <div className="right-card-title">

                    ⚡ Quick Actions

                </div>

                <button className="quick-btn">

                    Attendance Report

                </button>

                <button className="quick-btn">

                    Test Performance

                </button>

                <button className="quick-btn">

                    Generate PDF

                </button>

                <button className="quick-btn">

                    Notify Students

                </button>

            </div>

        </div>

    );

}

export default AiRightPanel;