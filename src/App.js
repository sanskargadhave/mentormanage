import { Layout } from "./Layout.js";
import "animate.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Routes, Route } from "react-router-dom";

import { StudentDashboardContent } from "./Main_pageComponent";
import {  Login } from "./login";
import { AdminSidebar} from "./admin component/AdminNevbar.js";

import { AddMentor } from "./admin component/addmentor.js";
import { DeleteUser } from "./admin component/deleteUser";
import { ViewUser } from "./admin component/viewUser";
import { AddStudent } from "./admin component/addStudent";
import {MentorDashboardContent} from "./mentor component/MentorDashbord.js";
import LogoutWarning from "./Logout.js";
import SidebarLayout from "./SidebarLayout.js";
import { AdminDashbord } from "./admin component/AdminDashbord.js";
import { AddTeacher } from "./admin component/addteacher.js";
import {AddLecture} from "./admin component/addLecture.js";
import { AddAttendance } from "./mentor component/addAttendance.js";
import { ViewStudent } from "./mentor component/viewstudent.js"; 
import { AssignMentor } from "./admin component/GiveMentor.js";
import {AddTestResult} from "./mentor component/addTestResult.js";
import AddAdmissionDetails from "./admin component/addAdmissionDetails.js"

function App() {
  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<StudentDashboardContent />} />

        {/* For Only login */}
        <Route path="/login" element={<Login />} />
        
        <Route path="/warning-logout" element={<LogoutWarning/>}/>

        {/* Admin */}
        <Route path="/admin" element={<SidebarLayout/>}>
          <Route index element={<AdminDashbord/>} />
          <Route path="add-mentor" element={<AddMentor />} />
          <Route path="add-student" element={<AddStudent />} />
          <Route path="admin-dashboard" element={<AdminSidebar />} />
          <Route path="view-users" element={<ViewUser />} />
          <Route path="delete-user" element={<DeleteUser />} />
          <Route path="warning-logout" element={<LogoutWarning/>}/>
          <Route path="add-teacher" element={<AddTeacher/>}/>
          <Route path="add-lecture" element={<AddLecture/>}/>
          <Route path="assign-mentor" element={<AssignMentor/>}/>
          <Route path="add-admission-details" element={<AddAdmissionDetails/>}/>
        </Route>


        {/* Mentor Layout */}
        <Route path="/mentor" element={<SidebarLayout />}>
          <Route index element={<MentorDashboardContent />} />
          <Route path="dashboard" element={<MentorDashboardContent />} />
          
          <Route path="add-student" element={<AddStudent />} />
          <Route path="view-users" element={<ViewUser />} />
          <Route path="delete-user" element={<DeleteUser />} />
          <Route path="add-attendance" element={<AddAttendance/>}/>
          <Route path="view-student" element={<ViewStudent/>}/>
          <Route path="add-test-result" element={<AddTestResult/>}/>
        </Route>

      </Route>
    </Routes>
  );
}

export default App;
