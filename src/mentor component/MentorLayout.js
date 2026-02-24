import { Outlet } from "react-router-dom";
import { MentorNavbar } from "./MentorNavigation.js";

function MentorLayout() {
  return (
    <div>
      {/* Mentor Sidebar */}
      <MentorNavbar />

      {/* Mentor Page Content */}
      <div className="mentor-content">
        <Outlet />
      </div>
    </div>
  );
}

export default MentorLayout;
