  import { Layout } from "./Layout.js";
  import "animate.css";
  import "bootstrap-icons/font/bootstrap-icons.css";
  import { Routes, Route } from "react-router-dom";
  import { useNavigate } from "react-router-dom";
  import { StudentDashboardContent } from "./public component/Main_pageComponent";
  import {  Login } from "./public component/login";
  import { AdminSidebar} from "./admin component/AdminNevbar.js";
  import StudentDashbord from "./student comonent/StudentDashbord.js";
  import { AddMentor } from "./public component/addmentor.js";
  import { DeleteUser } from "./admin component/deleteUser";
  import { ViewUser } from "./admin component/viewUser";
  import { AddStudent } from "./public component/addStudent.js";
  import {MentorDashboardContent} from "./mentor component/MentorDashbord.js";
  import LogoutWarning from "./public component/Logout.js";
  import SidebarLayout from "./SidebarLayout.js";
  import { AdminDashbord } from "./admin component/AdminDashbord.js";
  import { AddTeacher } from "./public component/addteacher.js";
  import {AddLecture} from "./admin component/addLecture.js";
  import { AddAttendance } from "./mentor component/addAttendance.js";
  import { ViewStudent } from "./mentor component/viewstudent.js"; 
  import {AddTestResult} from "./mentor component/addTestResult.js";
  import ProtectedRoute from "./protectedRoute.js"; 
  import LeaveApplication from "./student comonent/leaveApplication.js";
  import Settings from "./public component/settings.js";
  import Notification from "./public component/notification.js";
  import { StudentDetails,LeaveDetails,MentorDetails,TeacherDetails,ReportDetails } from "./public component/notificationpages.js";
  import { ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import ForgetPassword from "./public component/forgetPassword.js";
  import StudentChart from "./student comonent/student Annalytics/StudentAnnalytics.js";
  import MentorChart from "./mentor component/mentor analytics/mentorAnalytics.js";
  import SaarthiAI from "./mentor component/SaarthiAi/SaarthiAi.js";
  import AssignmentAction from "./mentor component/AssignmentControle/assignmentAction.js";
  import { use } from "react";
  function App() {
    
    const navigate=useNavigate();
    return (<>
      <Routes>
        <Route path="/unauthorized" element={
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>❌Access Denied❌</h1>
            <p>Your session expired or you don’t have permission.</p>
            
            <a href="/login">Login Again</a>
          </div>} />
          <Route path="/register-student" element={<AddStudent />} />
          <Route path="/register-mentor" element={<AddMentor />} />
          <Route path="/register-teacher" element={<AddTeacher/>}/>
          <Route path="/forget-password" element={<ForgetPassword/>}/>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute allowedRoles={["Mentor"]} />}>
            <Route path="/mentor-SaarthiAiChat" element={<SaarthiAI/>}/>
          </Route>
        <Route element={<Layout/>}>
          {/* Public */}
          
          <Route path="/" element={<StudentDashboardContent />} />

          
          
          {/* For Only login */}
        
          <Route path="/settings" element={<Settings/>}/>
          <Route path="/warning-logout" element={<LogoutWarning/>}/>

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/admin" element={<SidebarLayout/>}>
              <Route index element={<Notification/>} />
              <Route path="admin-dashboard" element={<AdminDashbord/>} />
              <Route path="add-mentor" element={<AddMentor />} />
              <Route path="add-student" element={<AddStudent />} />
              <Route path="admin-dashboard" element={<  AdminSidebar />} />
              <Route path="view-users" element={<ViewUser />} />
              <Route path="delete-user" element={<DeleteUser />} />
              <Route path="warning-logout" element={<LogoutWarning/>}/>
              <Route path="add-teacher" element={<AddTeacher/>}/>
              <Route path="add-lecture" element={<AddLecture/>}/>
              <Route path="mentor/:id" element={<MentorDetails />} />
              <Route path="teacher/:id" element={<TeacherDetails />} />
              <Route path="leave/:id" element={<LeaveDetails />} />
              <Route path="report/:id" element={<ReportDetails />} />
            </Route>
          </Route>


          {/* Mentor Layout */}
         <Route element={<ProtectedRoute allowedRoles={["Mentor"]} />}>
            <Route path="/mentor" element={<SidebarLayout />}>
              <Route index element={<Notification />} />
              <Route path="dashboard" element={<MentorDashboardContent />} />
            
              <Route path="add-student" element={<AddStudent />} />
              <Route path="view-users" element={<ViewUser />} />
              <Route path="delete-user" element={<DeleteUser />} />
              <Route path="add-attendance" element={<AddAttendance/>}/>
              <Route path="view-student" element={<ViewStudent/>}/>
              <Route path="add-test-result" element={<AddTestResult/>}/>
              <Route path="student/:id" element={<StudentDetails />} />
              <Route path="leave/:id" element={<LeaveDetails />} />
              <Route path="chart" element={<MentorChart/>}/>
              <Route path="assignment-controler" element={<AssignmentAction/>}/>
            </Route>
          </Route>

          {/*   Teacher Layout */}
          <Route element={<ProtectedRoute allowedRoles={["Teacher"]}/>}>
            <Route path="/teacher" element={<SidebarLayout/>}>

            </Route>
          
          </Route>

          {/*  Student Layout */}
          <Route element={<ProtectedRoute allowedRoles={["Student"]}/>}>
            <Route path="/student" element={<SidebarLayout/>}>
              <Route index element={<StudentDashbord/>}/>
              <Route path="leave-application-to-mentor" element={<LeaveApplication/>}/>
              <Route path="chart" element={<StudentChart/>}/>

            
            </Route>
          </Route>
           
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </>
    );
  }

  export default App;
