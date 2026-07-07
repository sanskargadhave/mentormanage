import "./Sidebar.css";
function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-section brand">
                    <h2>MentorManage</h2>
                    <p>
                        Empowering mentors and students with better
                        communication, tracking and analytics.
                    </p>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <a href="/">Dashboard</a>
                    <a href="/students">Students</a>
                    <a href="/mentors">Mentors</a>
                </div>

                <div className="footer-section">
                    <h4>Reports</h4>
                    <a href="#">Attendance</a>
                    <a href="#">Performance</a>
                    <a href="#">Analytics</a>
                </div>

                <div className="footer-section">
                    <h4>Resources</h4>
                    <a href="#">Documentation</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms & Conditions</a>
                </div>

            </div>

            <div className="footer-bottom">
                © 2026 MentorManage | Version 1.0.0
            </div>
        </footer>
    );
}

export default Footer;