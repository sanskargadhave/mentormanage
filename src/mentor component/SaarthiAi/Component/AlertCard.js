import "./AlertCard.css";

function AlertCard() {

    const alerts = [

        {
            id: 1,
            type: "critical",
            title: "Students Below 75%",
            value: "12 Students",
            description: "Require immediate mentoring."
        },

        {
            id: 2,
            type: "warning",
            title: "Pending Leave",
            value: "5 Requests",
            description: "Waiting for approval."
        },

        {
            id: 3,
            type: "info",
            title: "Assignments Due",
            value: "8 Pending",
            description: "Submission deadline approaching."
        },

        {
            id: 4,
            type: "success",
            title: "Today's Attendance",
            value: "95.2%",
            description: "Excellent class attendance."
        }

    ];

    return (

        <div className="alert-card">

            <div className="alert-card-header">

                <h3>🚨 Academic Alerts</h3>

                <span>Live Monitoring</span>

            </div>

            <div className="alert-list">

                {alerts.map((alert) => (

                    <div
                        key={alert.id}
                        className={`alert-item ${alert.type}`}
                    >

                        <div className="alert-indicator"></div>

                        <div className="alert-content">

                            <h4>{alert.title}</h4>

                            <p>{alert.description}</p>

                        </div>

                        <div className="alert-value">

                            {alert.value}

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default AlertCard;