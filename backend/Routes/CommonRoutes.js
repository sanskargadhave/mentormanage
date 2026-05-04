const express =require("express");
const router=express.Router();

const {GetStudent,StudentCounts,StoreStudentDetails}=require("../controllers/StudentControler");
const {MentorCount,GetMentors}=require("../controllers/MentorControler");
const {GetLectures} =require("../controllers/LectureControler");
const {GetTeacher}=require("../controllers/TeacherControler");
const {GetAttendanceByLectureId}=require("../controllers/AttendanceControler");


router.get("/getlecture",GetLectures);
router.get("/getteacher",GetTeacher);
router.get("/getmentor",GetMentors);
router.get("/get-students",GetStudent);
router.get("/Mentor/count",MentorCount);
router.get("/students/count",StudentCounts);
router.get("/get-attendance/:lectureid",GetAttendanceByLectureId);

router.post("/add-student",StoreStudentDetails);

module.exports = router;
