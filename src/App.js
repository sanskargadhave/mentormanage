import { Layout } from "./Layout.js";
import "animate.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Routes, Route } from "react-router-dom";

import { StudentDashboardContent } from "./Main_pageComponent";
import { AdminLogin, MentorLogin, Login } from "./login";
import { AdminNavbar} from "./admin component/AdminNevbar.js";
import LogoutWarning from "./admin component/AdminNevbar.js";
import { AddMentor } from "./admin component/addmentor.js";
import { DeleteUser } from "./admin component/deleteUser";
import { ViewUser } from "./admin component/viewUser";
import { AddStudent } from "./admin component/addStudent";
import {MentorDashboardContent} from "./mentor component/MentorDashbord.js";
import MentorLayout from "./mentor component/MentorLayout.js";
import { AdminLayout } from "./admin component/AdminLayout.js";
import { AdminDashbord } from "./admin component/AdminDashbord.js";
import { Addstudent } from "./mentor component/addStudent.js";
import { AddTeacher } from "./admin component/addteacher.js";
import {AddLecture} from "./admin component/addLecture.js";
import { AddAttendance } from "./mentor component/addAttendance.js";
import { ViewStudent } from "./mentor component/viewstudent.js"; 
import { AssignMentor } from "./admin component/GiveMentor.js";
import {AddTestResult} from "./mentor component/addTestResult.js";
function App() {
  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<StudentDashboardContent />} />

        {/* For Only login */}
        <Route path="/login" element={<Login />} />
        <Route path="adminlogin" element={<AdminLogin />} />
        <Route path="/mentorlogin" element={<MentorLogin />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<AdminDashbord/>} />
          <Route path="add-mentor" element={<AddMentor />} />
          <Route path="add-student" element={<AddStudent />} />
          <Route path="admin-dashboard" element={<AdminNavbar />} />
          <Route path="view-users" element={<ViewUser />} />
          <Route path="delete-user" element={<DeleteUser />} />
          <Route path="warning-logout" element={<LogoutWarning/>}/>
          <Route path="add-teacher" element={<AddTeacher/>}/>
          <Route path="add-lecture" element={<AddLecture/>}/>
          <Route path="assign-mentor" element={<AssignMentor/>}/>
        </Route>


        {/* Mentor Layout */}
        <Route path="/mentor" element={<MentorLayout />}>
          <Route index element={<MentorDashboardContent />} />
          <Route path="dashboard" element={<MentorDashboardContent />} />
          
          <Route path="add-student" element={<Addstudent />} />
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
