import "./QuickAction.css";

function QuickAction({ onSelect }) {

    const actions = [

        {
            icon: "📊",
            title: "Attendance Report",
            prompt: "Generate attendance report for all assigned students."
        },

        {
            icon: "⚠️",
            title: "Below 75%",
            prompt: "Show students whose attendance is below 75%."
        },

        {
            icon: "📝",
            title: "Leave Requests",
            prompt: "Show all pending leave applications."
        },

        {
            icon: "📚",
            title: "Assignment Status",
            prompt: "Show assignment completion status."
        },

        {
            icon: "📈",
            title: "Test Performance",
            prompt: "Show latest test performance."
        },

        {
            icon: "📄",
            title: "Generate Report",
            prompt: "Generate complete mentor performance report."
        }

    ];

    return (

        <div className="quick-action">

            <div className="quick-action-header">

                <h3>⚡ Quick Actions</h3>

                <span>One click AI commands</span>

            </div>

            <div className="quick-action-grid">

                {

                    actions.map((item, index) => (

                        <button

                            key={index}

                            className="quick-action-card"

                            onClick={() => onSelect?.(item.prompt)}

                        >

                            <div className="quick-icon">

                                {item.icon}

                            </div>

                            <span>

                                {item.title}

                            </span>

                        </button>

                    ))

                }

            </div>

        </div>

    );

}

export default QuickAction;