import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");

  
  if (!token) {
    return <Navigate to="/unauthorized" />;
  }

  try {
    const decoded = jwtDecode(token);

   
    if (!allowedRoles.includes(decoded.role)) {
      return <Navigate to="/unauthorized" />;
    }

    
    return <Outlet />;
    
  } catch (err) {
    return <Navigate to="/unauthorized" />;
  }
}

export default ProtectedRoute;