const express =require("express");
const router=express.Router();
const {AddMentor}=require("../controllers/MentorControler");
const {AddTeacher}=require("../controllers/TeacherControler");
const {uploadProfile,upload}=require("../middleware/uplodemiddleware");              
const {GetStudent,StudentCounts,StoreStudentDetails}=require("../controllers/StudentControler");
const {MentorCount,GetMentors}=require("../controllers/MentorControler");
const {GetLectures} =require("../controllers/LectureControler");
const {GetTeacher}=require("../controllers/TeacherControler");
const {GetAttendanceByLectureId}=require("../controllers/AttendanceControler");
const {StoreAttendances}=require("../controllers/AttendanceControler");
const {Counts}=require("../controllers/commoncontroler");

router.get("/getlecture",GetLectures);
router.get("/getteacher",GetTeacher);
router.get("/getmentor",GetMentors);
router.get("/get-students",GetStudent);
router.get("/Mentor/count",MentorCount);
router.get("/students/count",StudentCounts);
router.get("/get-attendance/:lectureid",GetAttendanceByLectureId);
router.get("/User-Counts",Counts);


router.post("/store-attendance",StoreAttendances);
router.post("/add-student",upload.single("profileImage"),uploadProfile,StoreStudentDetails);
router.post("/add-mentor",upload.single("profileImage"),uploadProfile,AddMentor);
router.post("/add-teacher",upload.single("profileImage"),uploadProfile,AddTeacher);

module.exports = router;
