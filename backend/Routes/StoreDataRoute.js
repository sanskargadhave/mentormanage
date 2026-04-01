const express =require("express");
const router=express.Router();

const {StoreStudentDetails}=require("../controllers/StudentControler");
const {StoreAttendances}=require("../controllers/AttendanceControler");
const {AddMentor,MentorLogin}=require("../controllers/MentorControler");
const {StoreLectures} =require("../controllers/LectureControler");
const {AdminLogin}=require("../controllers/AdminControler");
const {AddTeacher}=require("../controllers/TeacherControler");
const {StoreTest}=require("../controllers/TestControler");
const CreateTestId=require("../middleware/testMiddleware");
const {sendMessage}=require("../controllers/messagecontroler");
const {getexcelsheet}=require("../controllers/getexceldata");
const {uplode,iscorrectdata}=require("../middleware/exceldataMiddleware");




router.post("/add-student",StoreStudentDetails);

router.post("/api/store-attendance",StoreAttendances);

router.post("/api/add-mentor",AddMentor);
router.post("/api/mentor-login",MentorLogin);
router.post("/api/store-lecture",StoreLectures);

router.post("/api/admin-login",AdminLogin);
router.post("/api/add-teacher",AddTeacher);
router.post("/api/store-test-result",CreateTestId,StoreTest);
router.post("/api/sendMessage", sendMessage);
router.post("/api/store-excel-data",uplode.single("file"),iscorrectdata,getexcelsheet);

module.exports = router;