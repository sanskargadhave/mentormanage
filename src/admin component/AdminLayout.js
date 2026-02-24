 import {AdminNavbar} from "./AdminNevbar" ;  
 import { Outlet } from "react-router-dom";
function AdminLayout() {
  return (
    <>

      <AdminNavbar/>
      <div className="admin-content">  
        <Outlet />  
      </div>
    </>
  );
}
export {AdminLayout};