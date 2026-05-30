const express =require("express");
const router=express.Router();
const {getMentordetails,sendApplication,getapplication,getProfiledetails,updateProfiledetails}=require("../controllers/StudentControler");
const verifyToken=require("../middleware/authmiddleware");
const isStudent=require("../middleware/isstudentmiddleware");

router.use(verifyToken,isStudent);

router.get("/get-mentordetails/:studentid",getMentordetails);
router.get("/get-student-applications/:id",getapplication);
router.get("/get-profiledetails/:id",getProfiledetails);
router.get("/updateprofile-details",updateProfiledetails);


router.post("/send-application",sendApplication);

module.exports = router;
