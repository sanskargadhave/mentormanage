const express =require("express");
const router=express.Router();
const {giveApprove,giveReject}=require("../controllers/StudentControler")
const {AssignMentor}=require("../controllers/MentorControler");

router.put("/api/assign-mentors",AssignMentor);
router.put("/api/give-approve",giveApprove);
router.put("/api/give-reject",giveReject);

module.exports = router;