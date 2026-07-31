import "./ChartCard.css";

function ChartCard({
    title,
    subtitle,
    children,
    className = ""
}) {
    return (

        <div className={`chart-card ${className}`}>

            <div className="chart-card-header">

                <div className="chart-card-title-wrapper">

                    <h3>{title}</h3>

                    {subtitle && (
                        <span>{subtitle}</span>
                    )}

                </div>

            </div>


            <div className="chart-card-body">

                {children}

            </div>

        </div>

    );

}

export default ChartCard;