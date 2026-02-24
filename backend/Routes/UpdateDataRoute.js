const express =require("express");
const router=express.Router();

const {AssignMentor}=require("../controllers/MentorControler");


router.put("/api/assign-mentors",AssignMentor);

module.exports = router;