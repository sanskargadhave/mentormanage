const express =require("express");
const router=express.Router();

const {GetStudentDetailsByRoll,SearchStudent}=require("../controllers/StudentControler"); 
const {MakeAttendanceReport,GetTodayAttendance}=require("../controllers/AttendanceControler");
const getNotification =require("../controllers/notificationControler");
const {sendMessage}=require("../controllers/messagecontroler");
const {getexcelsheet}=require("../controllers/getexceldata");
const {uplode,iscorrectdata}=require("../middleware/exceldataMiddleware");
const {giveApprove,giveReject}=require("../controllers/StudentControler");
const verifyToken=require("../middleware/authmiddleware");
const isMentor=require("../middleware/ismentormiddleware");

router.use(verifyToken,isMentor);

router.get("/serach-student/:lectureid",SearchStudent);
router.get("/get-studentdetails/:rollno",GetStudentDetailsByRoll);

router.get("/make-attendance-report",MakeAttendanceReport);
router.get("/get-today-attendance",GetTodayAttendance);
router.get("/get-notifications/:mentorid",getNotification);


router.post("/store-excel-data",uplode.single("file"),iscorrectdata,getexcelsheet);
router.post("/sendMessage", sendMessage);

router.put("/give-approve/:studentid",giveApprove);
router.put("/give-reject/:studentid",giveReject);

module.exports = router;
