const express =require("express");
const router=express.Router();
const {getMentordetails}=require("../controllers/StudentControler");
const verifyToken=require("../middleware/authmiddleware");
const isStudent=require("../middleware/isstudentmiddleware");

router.use(verifyToken,isStudent);

router.get("/get-mentordetails/:studentid",getMentordetails);
module.exports = router;
