import { NevigationBar } from "./public component/nevigationBar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Footer from "./footer"; 

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