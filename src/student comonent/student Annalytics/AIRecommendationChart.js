import { useEffect, useState } from "react";
import "./StudentAnnalytics.css";

function AIRecommendationChart({ recommendation }) {

    const [visible, setVisible] = useState(false);

    useEffect(() => {

        if (recommendation) {

            const timer = setTimeout(() => {
                setVisible(true);
            }, 100);

            return () => clearTimeout(timer);

        }

    }, [recommendation]);


    if (!recommendation) {

        return (
            <div className="ai-empty-state">
                <div className="ai-loading-orb">
                    🕸️
                </div>

                <p>
                    AI is analyzing your academic performance...
                </p>
            </div>
        );

    }


    const {

        attendancePercentage = 0,

        riskScore = 0,

        riskLevel = "Unknown",

        status = "Unknown",

        reasons = [],

        recommendations = [],

        WeakSubject = [],

        StrongSubjects = [],

        AttendanceRecovery,

        positiveIndications = []

    } = recommendation;


    const isHighRisk =
        riskLevel === "High Risk";


    const getRiskClass = () => {

        if (riskLevel === "High Risk") {

            return "risk-high";

        }

        if (riskLevel === "Medium Risk") {

            return "risk-medium";

        }

        return "risk-low";

    };


    return (

        <div
            className={`ai-recommendation-wrapper
            ${visible ? "ai-visible" : ""}`}
        >

            {/* ================= HEADER ================= */}

            <div className="ai-header">

                <div className="ai-title-section">

                    <div className="ai-icon">

                        <span>🕸️</span>

                    </div>


                    <div>

                        <h3>
                           Saarthi Ai Agent
                        </h3>

                        <p>
                            Personalized academic analysis
                        </p>

                    </div>

                </div>


                <div className="ai-status-dot">

                    <span></span>

                    AI Active

                </div>

            </div>


            {/* ================= SCORE SECTION ================= */}

            <div className="ai-score-grid">

                <div className="ai-score-card">

                    <div className="ai-score-ring">

                        <div className="ai-score-value">

                            {attendancePercentage}%

                        </div>

                    </div>


                    <div>

                        <span>
                            Attendance
                        </span>

                        <strong>
                            Required: 75%
                        </strong>

                    </div>

                </div>


                <div
                    className={`ai-risk-card
                    ${getRiskClass()}`}
                >

                    <div className="risk-card-top">

                        <span>
                            Risk Score
                        </span>

                        <strong>
                            {riskScore}/100
                        </strong>

                    </div>


                    <div className="risk-progress">

                        <div
                            style={{
                                width: `${riskScore}%`
                            }}
                        ></div>

                    </div>


                    <div className="risk-bottom">

                        <span>
                            {riskLevel}
                        </span>

                        <b>
                            {status}
                        </b>

                    </div>

                </div>

            </div>


            {/* ================= RECOVERY ================= */}

            {AttendanceRecovery?.required && (

                <div className="ai-recovery-card">

                    <div className="recovery-icon">

                        🎯

                    </div>


                    <div className="recovery-content">

                        <div className="recovery-title">

                            <strong>
                                Attendance Recovery Plan
                            </strong>

                            <span>
                                {AttendanceRecovery.expectedPercentage}%
                            </span>

                        </div>


                        <p>

                            Attend the next{" "}

                            <b>
                                {AttendanceRecovery.lecturesToAttend}
                            </b>{" "}

                            lectures continuously to reach{" "}

                            <b>
                                {AttendanceRecovery.requiredPercentage}%
                            </b>.

                        </p>


                        <div className="recovery-progress">

                            <div>

                                <span>
                                    {AttendanceRecovery.currentPercentage}%
                                </span>

                                <span>
                                    {AttendanceRecovery.requiredPercentage}%
                                </span>

                            </div>


                            <div className="recovery-bar">

                                <div
                                    style={{
                                        width: `${Math.min(
                                            AttendanceRecovery.currentPercentage,
                                            100
                                        )}%`
                                    }}
                                ></div>

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* ================= POSITIVE INDICATION ================= */}

            {positiveIndications.length > 0 && (

                <div className="ai-section positive-section">

                    <div className="section-heading">

                        <span className="section-icon">
                            ✨
                        </span>

                        <h4>
                            Your Achievements
                        </h4>

                    </div>


                    <div className="positive-list">

                        {positiveIndications.map(

                            (item, index) => (

                                <div
                                    className="positive-item"
                                    key={index}
                                >

                                    <div className="positive-check">

                                        ✓

                                    </div>


                                    <div>

                                        <strong>
                                            {item.title}
                                        </strong>

                                        <p>
                                            {item.message}
                                        </p>

                                    </div>

                                </div>

                            )

                        )}

                    </div>

                </div>

            )}


            {/* ================= WEAK SUBJECTS ================= */}

            {WeakSubject.length > 0 && (

                <div className="ai-section">

                    <div className="section-heading">

                        <span className="section-icon warning-icon">
                            ⚠
                        </span>

                        <h4>
                            Focus Areas
                        </h4>

                    </div>


                    <div className="weak-subject-list">

                        {WeakSubject.map(

                            (subject, index) => (

                                <div
                                    className="weak-subject-item"
                                    key={index}
                                >

                                    <div className="subject-info">

                                        <span>
                                            {subject.subject}
                                        </span>

                                        <b>
                                            {subject.percentage}%
                                        </b>

                                    </div>


                                    <div className="subject-progress">

                                        <div
                                            style={{
                                                width: `${subject.percentage}%`
                                            }}
                                        ></div>

                                    </div>

                                </div>

                            )

                        )}

                    </div>

                </div>

            )}


            {/* ================= RECOMMENDATIONS ================= */}

            {recommendations.length > 0 && (

                <div className="ai-section">

                    <div className="section-heading">

                        <span className="section-icon">
                            💡
                        </span>

                        <h4>
                            Recommended Actions
                        </h4>

                    </div>


                    <div className="recommendation-list">

                        {recommendations.map(

                            (item, index) => (

                                <div
                                    className={`recommendation-item
                                    priority-${item.priority.toLowerCase()}`}
                                    key={index}
                                >

                                    <div className="recommendation-priority">

                                        {item.priority === "High"
                                            ? "!"
                                            : "•"}

                                    </div>


                                    <div>

                                        <strong>
                                            {item.title}
                                        </strong>

                                        <p>
                                            {item.message}
                                        </p>

                                    </div>

                                </div>

                            )

                        )}

                    </div>

                </div>

            )}


            {/* ================= REASONS ================= */}

            <details className="ai-reasons">

                <summary>

                    <span>
                        🔍 Why am I seeing this?
                    </span>

                    <span>
                        +
                    </span>

                </summary>


                <div className="reasons-list">

                    {reasons.map(

                        (reason, index) => (

                            <div
                                key={index}
                            >

                                <span>
                                    •
                                </span>

                                <p>
                                    {reason}
                                </p>

                            </div>

                        )

                    )}

                </div>

            </details>


            {/* ================= FOOTER ================= */}

            <div className="ai-footer">

                <span>
                    ✦ Generated from your semester analytics
                </span>

                <span>
                    Updated automatically
                </span>

            </div>

        </div>

    );

}


export default AIRecommendationChart;