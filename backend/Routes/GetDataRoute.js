const express =require("express");
const router=express.Router();

const {GetStudentDetailsByRoll,SearchStudent,StudentCounts,GetStudent}=require("../controllers/StudentControler");
const {GetAttendanceByLectureId}=require("../controllers/AttendanceControler");
const {MentorCount,GetMentors}=require("../controllers/MentorControler");
const {GetLectures} =require("../controllers/LectureControler");
const {GetTeacher}=require("../controllers/TeacherControler");
const {UserCounts}=require("../controllers/AdminControler");
const {GetTestSummery,MakeTestReport}=require("../controllers/TestControler");
const getNotification =require("../controllers/notificationControler");

router.get("/api/students/count",StudentCounts);
router.get("/api/serach-student/:lectureid",SearchStudent);
router.get("/api/get-studentdetails/:rollno",GetStudentDetailsByRoll);
router.get("/api/get-attendance/:lectureid",GetAttendanceByLectureId);
router.get("/api/Mentor/count",MentorCount);
router.get("/api/getlecture",GetLectures);
router.get("/api/getteacher",GetTeacher);
router.get("/api/getmentor",GetMentors);
router.get("/api/get-students",GetStudent);
router.get("/api/get-usercounts",UserCounts);
router.get("/api/get-test-summery/:testid",GetTestSummery);
router.get("/api/make-test-report/:testid",MakeTestReport);
router.get("/api/get-notifications/:mentorid",getNotification);
module.exports = router;