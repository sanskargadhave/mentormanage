import "./fillAssignment.css"
function FillAssignment()
{
    return(
        <div className="assignment-record-container">

            {/* ================= Header ================= */}

            <div className="record-header">

                <div className="record-header-left">

                    <h2>
                        <i className="bi bi-journal-check"></i>
                        Assignment Record
                    </h2>

                    <p>
                        Manage assignment submission and evaluation records.
                    </p>

                </div>

                <div className="record-header-right">

                    <button className="record-btn refresh-btn">
                        <i className="bi bi-arrow-clockwise"></i>
                        Refresh
                    </button>

                    <button className="record-btn export-btn">
                        <i className="bi bi-file-earmark-excel"></i>
                        Export
                    </button>

                    <button className="record-btn save-btn">
                        <i className="bi bi-floppy-fill"></i>
                        Save Changes
                    </button>

                </div>

            </div>

            {/* ================= Assignment Details ================= */}

            <div className="assignment-info-card">

                <div className="assignment-info-item">

                    <span>Assignment</span>

                    <h5>Java Practical - 05</h5>

                </div>

                <div className="assignment-info-item">

                    <span>Subject</span>

                    <h5>Java Programming</h5>

                </div>

                <div className="assignment-info-item">

                    <span>Type</span>

                    <h5>Practical</h5>

                </div>

                <div className="assignment-info-item">

                    <span>Due Date</span>

                    <h5>10 Aug 2026</h5>

                </div>

                <div className="assignment-info-item">

                    <span>Maximum Marks</span>

                    <h5>20</h5>

                </div>

            </div>

            {/* ================= Statistics ================= */}

            <div className="record-stats">

                <div className="record-stat-card">

                    <i className="bi bi-people-fill"></i>

                    <div>

                        <h3>60</h3>

                        <p>Total Students</p>

                    </div>

                </div>

                <div className="record-stat-card">

                    <i className="bi bi-check-circle-fill"></i>

                    <div>

                        <h3>45</h3>

                        <p>Submitted</p>

                    </div>

                </div>

                <div className="record-stat-card">

                    <i className="bi bi-clock-fill"></i>

                    <div>

                        <h3>6</h3>

                        <p>Late</p>

                    </div>

                </div>

                <div className="record-stat-card">

                    <i className="bi bi-x-circle-fill"></i>

                    <div>

                        <h3>9</h3>

                        <p>Pending</p>

                    </div>

                </div>

            </div>

            {/* ================= Search & Filters ================= */}

            <div className="record-toolbar">

                <div className="record-search">

                    <i className="bi bi-search"></i>

                    <input
                        type="text"
                        placeholder="Search student..."
                    />

                </div>

                <select>

                    <option>All Status</option>

                    <option>Pending</option>

                    <option>Submitted</option>

                    <option>Late Submitted</option>

                    <option>Not Submitted</option>

                </select>

            </div>

            {/* ================= Table ================= */}

            <div className="record-table">

                <table>

                    <thead>

                        <tr>

                            <th>Roll No</th>

                            <th>Student Name</th>

                            <th>Status</th>

                            <th>Checked</th>

                            <th>Marks</th>

                            <th>Feedback</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {/* Row 1 */}

                        <tr>

                            <td>01</td>

                            <td>Rahul Patil</td>

                            <td>

                                <select>

                                    <option>Submitted</option>

                                    <option>Pending</option>

                                    <option>Late Submitted</option>

                                    <option>Not Submitted</option>

                                </select>

                            </td>

                            <td>

                                <input type="checkbox" />

                            </td>

                            <td>

                                <input
                                    type="number"
                                    placeholder="20"
                                />

                            </td>

                            <td>

                                <input
                                    type="text"
                                    placeholder="Feedback"
                                />

                            </td>

                            <td>

                                <button className="row-save-btn">

                                    <i className="bi bi-floppy-fill"></i>

                                </button>

                            </td>

                        </tr>

                        {/* Row 2 */}

                        <tr>

                            <td>02</td>

                            <td>Priya Sharma</td>

                            <td>

                                <select>

                                    <option>Pending</option>

                                    <option>Submitted</option>

                                    <option>Late Submitted</option>

                                    <option>Not Submitted</option>

                                </select>

                            </td>

                            <td>

                                <input type="checkbox" />

                            </td>

                            <td>

                                <input
                                    type="number"
                                    placeholder="20"
                                />

                            </td>

                            <td>

                                <input
                                    type="text"
                                    placeholder="Feedback"
                                />

                            </td>

                            <td>

                                <button className="row-save-btn">

                                    <i className="bi bi-floppy-fill"></i>

                                </button>

                            </td>

                        </tr>

                        {/* More rows here */}

                    </tbody>

                </table>

            </div>

        </div>



    );
}
export default FillAssignment;