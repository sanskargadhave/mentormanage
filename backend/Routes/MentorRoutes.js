const express =require("express");
const router=express.Router();

const {GetStudentDetailsByRoll,SearchStudent, givePermission,getStudentDetails,giveread}=require("../controllers/StudentControler"); 
const {generateReport,GetTodayAttendance,givepreview}=require("../controllers/AttendanceControler");
const {sendMessage}=require("../controllers/messagecontroler");
const {getexcelsheet}=require("../controllers/getexceldata");
const {uplode,iscorrectdata}=require("../middleware/exceldataMiddleware");
const {giveApprove,giveReject,getapplicationById}=require("../controllers/StudentControler");
const verifyToken=require("../middleware/authmiddleware");
const isMentor=require("../middleware/ismentormiddleware");

router.use(verifyToken,isMentor);

router.get("/serach-student/:lectureid",SearchStudent);
router.get("/get-studentdetails/:rollno",GetStudentDetailsByRoll);
router.get("/student/:id",getStudentDetails); 
router.get("/get-today-attendance",GetTodayAttendance);
router.get("/get-student-application/:id",getapplicationById);

router.post("/give-preview-report",givepreview);
router.post("/store-excel-data",uplode.single("file"),iscorrectdata,getexcelsheet);
router.post("/sendMessage", sendMessage);
router.post("/make-attendance-report",generateReport);
router.put("/give-approve/:studentid/:id",giveApprove);
router.put("/give-reject/:id",giveReject);
router.put("/give-permission/:permission/:applicationid",givePermission);

module.exports = router;
