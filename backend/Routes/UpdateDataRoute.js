const express =require("express");
const router=express.Router();
const {giveApprove,giveReject}=require("../controllers/StudentControler")
const {AssignMentor}=require("../controllers/MentorControler");

router.put("/api/assign-mentors",AssignMentor);
router.put("/api/give-approve/:studentid",giveApprove);
router.put("/api/give-reject/:studentid",giveReject);

module.exports = router;