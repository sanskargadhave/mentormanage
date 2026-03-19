import MainSidebar from "./MainSidebar";
import { Outlet,useOutletContext} from "react-router-dom";
import "./Sidebar.css";
import "./mentor component/mentor.css";

function SidebarLayout() {
  const { collapsed, setCollapsed } = useOutletContext();
  

  return (
    <div className="mentor-layout">

      {/* Sidebar */}
      <MainSidebar collapsed={collapsed} />

      {/* Overlay for mobile */}
      {collapsed && (
        <div
          className="sidebar-overlay"
          onClick={()=>setCollapsed(false)}
        ></div>
      )}

      {/* Page Content */}
      <div className="mentor-page-content">

        <button
          className={`collapse-btn ${collapsed ? "active" : ""}`}
          onClick={() => setCollapsed(!collapsed)}
        >
        <i className={`bi ${collapsed ? "bi-x" : "bi-list"}`}></i>
        </button>

        <Outlet />

      </div>

    </div>
  );
}

export default SidebarLayout;