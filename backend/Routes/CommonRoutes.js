const express =require("express");
const router=express.Router();
const {AddMentor}=require("../controllers/MentorControler");
const {AddTeacher}=require("../controllers/TeacherControler");
const {uploadProfile,upload}=require("../middleware/uplodemiddleware");              
const {GetStudent,StudentCounts,StoreStudentDetails,giveread}=require("../controllers/StudentControler");
const {MentorCount,GetMentors}=require("../controllers/MentorControler");
const {GetLectures} =require("../controllers/LectureControler");
const {GetTeacher}=require("../controllers/TeacherControler");
const {GetAttendanceByLectureId}=require("../controllers/AttendanceControler");
const {StoreAttendances}=require("../controllers/AttendanceControler");
const {Counts,getspotlight}=require("../controllers/commoncontroler");
const {getNotification,getLetestNotification} =require("../controllers/notificationControler");
const verifyToken=require("../middleware/authmiddleware");
const {SendResetOtp,VerifyOtp,ResetPassword}=require("../controllers/sendResetOtp");

router.get("/getlecture",GetLectures);
router.get("/getteacher",GetTeacher);
router.get("/getmentor",GetMentors);
router.get("/get-students",GetStudent);
router.get("/Mentor/count",MentorCount);
router.get("/students/count",StudentCounts);
router.get("/get-attendance/:lectureid",GetAttendanceByLectureId);
router.get("/User-Counts",Counts);
router.get("/get-notifications/:id",verifyToken,getNotification);
router.get("/get-latestnotification/:id",verifyToken,getLetestNotification);
router.get("/get-spotlight-dashboard",getspotlight);

router.post("/store-attendance",StoreAttendances);
router.post("/add-student",upload.single("profileImage"),uploadProfile,StoreStudentDetails);
router.post("/add-mentor",upload.single("profileImage"),uploadProfile,AddMentor);
router.post("/add-teacher",upload.single("profileImage"),uploadProfile,AddTeacher);
router.post("/send-reset-otp",SendResetOtp);
router.post("/verify-user-otp",VerifyOtp);
router.post("/reset-user-password",ResetPassword);
router.put("/notification-isread/:id",giveread);

module.exports = router;
