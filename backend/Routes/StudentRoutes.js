const express =require("express");
const router=express.Router();
const {getMentordetails,sendApplication}=require("../controllers/StudentControler");
const verifyToken=require("../middleware/authmiddleware");
const isStudent=require("../middleware/isstudentmiddleware");

router.use(verifyToken,isStudent);

router.get("/get-mentordetails/:studentid",getMentordetails);

router.post("/send-application",sendApplication);
module.exports = router;
