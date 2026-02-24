const express =require("express");
const router=express.Router();


const {StoreStudentDetails}=require("../controllers/StudentControler");
const {StoreAttendances}=require("../controllers/AttendanceControler");
const {AddMentor,MentorLogin}=require("../controllers/MentorControler");
const {StoreLectures} =require("../controllers/LectureControler")
const {AdminLogin}=require("../controllers/AdminControler");
const {AddTeacher}=require("../controllers/TeacherControler")


router.post("/add-student",StoreStudentDetails);

router.post("/api/store-attendance",StoreAttendances);

router.post("/api/add-mentor",AddMentor);
router.post("/api/mentor-login",MentorLogin);
router.post("/api/store-lecture",StoreLectures);

router.post("/api/admin-login",AdminLogin);
router.post("/api/add-teacher",AddTeacher);

module.exports = router;