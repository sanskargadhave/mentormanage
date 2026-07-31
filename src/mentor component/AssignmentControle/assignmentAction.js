import "./assignmentAction.css";
import { useState } from "react";

import AddAssignment from "./addAssignment";
import FillAssignment from "./fillAssignment";
import EditAssignment from "./editAssignment";
import DeleteAssignment from "./deleteAssignment";
import AssignmentRecord from "./assignmentRecord";

function AssignmentAction() {

    const [activeTab, setActiveTab] = useState("add");

    return (

        <div className="assignment-page">

            {/* Header */}

            <div className="assignment-header">

                <div className="assignment-top">

                    <h4 className="assignment-title">
                        <i className="bi bi-journal-bookmark-fill"></i>
                        Assignment Management
                    </h4>

                </div>

                <div className="assignment-tabs">

                    <button
                        className={`assignment-tab ${activeTab === "add" ? "active" : ""}`}
                        onClick={() => setActiveTab("add")}
                    >
                        Add Assignment
                    </button>

                    <button
                        className={`assignment-tab ${activeTab === "list" ? "active" : ""}`}
                        onClick={() => setActiveTab("list")}
                    >
                        Assignment List
                    </button>

                    <button
                        className={`assignment-tab ${activeTab === "records" ? "active" : ""}`}
                        onClick={() => setActiveTab("records")}
                    >
                        Fill Records
                    </button>

                    <button
                        className={`assignment-tab ${activeTab === "reports" ? "active" : ""}`}
                        onClick={() => setActiveTab("reports")}
                    >
                        Reports
                    </button>

                </div>

            </div>

            {/* Content */}

            <div className="assignment-content">

                {activeTab === "add" && <AddAssignment />}

                {activeTab === "list" && <AssignmentRecord />}

                {activeTab === "records" && <FillAssignment />}

                {activeTab === "edit" && <EditAssignment />}

                {activeTab === "delete" && <DeleteAssignment />}

                {activeTab === "reports" && (
                    <div className="coming-soon">
                        <i className="bi bi-bar-chart-fill"></i>
                        <h3>Reports Coming Soon</h3>
                    </div>
                )}

            </div>

        </div>

    );

}

export default AssignmentAction;