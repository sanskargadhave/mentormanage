import { NevigationBar } from "./nevigationBar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function Layout() {

  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Navbar */}
      <NevigationBar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
      />

      {/* Page Content */}
      <div className="page-content">
        <Outlet context={{ collapsed, setCollapsed }} />
      </div>
    </>
  );
}

export { Layout };