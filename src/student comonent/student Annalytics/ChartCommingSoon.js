import "./StudentAnnalytics.css";

function ChartComingSoon({
    title = "Analytics Coming Soon",
    message = "This analysis will be available soon.",
    icon = "bi-bar-chart-line"
}) {
    return (
        <div className="chart-coming-soon">

            <div className="coming-soon-icon">
                <i className={`bi ${icon}`}></i>
            </div>

            <div className="coming-soon-content">

                <h3>{title}</h3>

                <p>{message}</p>

                <div className="coming-soon-status">
                    <span className="status-dot"></span>
                    Analytics module is being prepared
                </div>

            </div>

        </div>
    );
}

export default ChartComingSoon;