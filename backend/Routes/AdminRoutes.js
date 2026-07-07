const express =require("express");
const router=express.Router();

const {UserCounts,DashboardAnalysis, fetchdata}=require("../controllers/AdminControler");

const {StoreLectures} =require("../controllers/LectureControler");
const {getMentorDetails}=require("../controllers/MentorControler");
const {getTeacherDetails,giveRejectTeacher,giveApproveTeacher}=require("../controllers/TeacherControler");
const {AssignMentor,giveRejectMentor,giveApproveMentor}=require("../controllers/MentorControler");
const verifyToken=require("../middleware/authmiddleware");
const isAdmin=require("../middleware/isadminmiddleware");
const {getNotification} =require("../controllers/notificationControler");
const { getreportDetails } = require("../controllers/AttendanceControler");


router.use(verifyToken,isAdmin);

router.get("/mentor/:id",getMentorDetails);
router.get("/teacher/:id",getTeacherDetails);
router.get("/get-usercounts",UserCounts);
router.get("/get-notifications/:id",getNotification);
router.get("/get-report-details/:id",getreportDetails);
router.get("/dashboard-analysis",DashboardAnalysis);
router.get("/fetch-details",fetchdata);
router.post("/store-lecture",StoreLectures);


router.put("/assign-mentors",AssignMentor);

router.put("/mentor/give-approve/:mentorId/:id",giveApproveMentor);
router.put("/mentor/give-reject/:id",giveRejectMentor);

router.put("/teacher/give-approve/:TeacherId/:id",giveApproveTeacher);
router.put("/teacher/give-reject/:id",giveRejectTeacher);
module.exports = router;