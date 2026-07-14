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

            <div class="developer-connect">

    <h4>
        <i class="bi bi-person-lines-fill set-icon"></i>
        Connect with the Developer
    </h4>

    <div class="social-links">

        <a href="https://www.linkedin.com/in/sanskar-gadhave-74b5313b9"
           target="_blank"
           class="social-card linkedin">

            <i class="bi bi-linkedin"></i>

            <div>
                <span>LinkedIn</span>
                <small>GadhaveSanskarShantinath.linkedin</small>
            </div>

        </a>

        <a href="https://www.instagram.com/sanskargadhave_100?igsh=MWF1bDRvN3hudWduMg=="
           target="_blank"
           class="social-card instagram">

            <i class="bi bi-instagram"></i>

            <div>
                <span>Instagram</span>
                <small>@sanskargadhave_100</small>
            </div>

        </a>

        <a href="mailto:sanskargadhave024@gmail.com"
           class="social-card email">

            <i class="bi bi-envelope-fill"></i>

            <div>
                <span>Email</span>
                <small>sanskargadhave024@gmail.com</small>
            </div>

        </a>

    </div>

</div>
            <div className="developer-footer">

    <div className="footer-line"></div>

    <div className="developer-badge">

        <i className="bi bi-code-slash"></i>

        <span>Designed & Developed by</span>

    </div>

    <h3>Sanskar Gadhave</h3>

    <p className="developer-course">
       BCS Computer Science (Second Year Division:-A) 
    </p>

   

</div>
        </footer>
    );
}

export default Footer;