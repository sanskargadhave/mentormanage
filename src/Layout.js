 import {NevigationBar} from "./nevigationBar" ;  
 import { Outlet } from "react-router-dom";
function Layout() {
  return (
    <>
      <NevigationBar/>
      <div className="page-content">  
        <Outlet />  
      </div>
    </>
  );
}
export {Layout};