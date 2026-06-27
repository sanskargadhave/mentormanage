const express =require("express");
const router=express.Router();

const {UserCounts}=require("../controllers/AdminControler");

const {StoreLectures} =require("../controllers/LectureControler");

const {AssignMentor}=require("../controllers/MentorControler");
const verifyToken=require("../middleware/authmiddleware");
const isAdmin=require("../middleware/isadminmiddleware");



router.use(verifyToken,isAdmin);

router.get("/get-usercounts",UserCounts);



router.post("/store-lecture",StoreLectures);


router.put("/assign-mentors",AssignMentor);

module.exports = router;