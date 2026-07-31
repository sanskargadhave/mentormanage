import "./AiSidebar.css";

function AiSidebar() {

    const modules = [
        "📊 Attendance",
        "📝 Assignments",
        "📚 Test Results",
        "📄 Leave Applications",
        "👥 Student Profile",
        "📈 Analytics"
    ];

    const recentSearches = [
        "Roll No. 3103",
        "Attendance below 75%",
        "Weekly Report",
        "Leave Applications"
    ];

    return (

        <div className="ai-sidebar-container">

            {/* Search */}

            <div className="sidebar-card">

                <h3>🔍 Student Search</h3>

                <input
                    type="text"
                    placeholder="Name or Roll No."
                    className="sidebar-search"
                />

                <button className="sidebar-search-btn">

                    Search Student

                </button>

            </div>

            {/* Modules */}

            <div className="sidebar-card">

                <h3>📚 Academic Modules</h3>

                {
                    modules.map((item,index)=>(

                        <button
                            key={index}
                            className="sidebar-module-btn"
                        >

                            {item}

                        </button>

                    ))
                }

            </div>

            {/* Recent */}

            <div className="sidebar-card">

                <h3>🕒 Recent Searches</h3>

                {
                    recentSearches.map((item,index)=>(

                        <div
                            key={index}
                            className="recent-item"
                        >

                            {item}

                        </div>

                    ))
                }

            </div>

        </div>

    );

}

export default AiSidebar;