const express =require("express");
const router=express.Router();

const {UserCounts}=require("../controllers/AdminControler");
const {AddMentor}=require("../controllers/MentorControler");
const {StoreLectures} =require("../controllers/LectureControler");
const {AddTeacher}=require("../controllers/TeacherControler");
const {AssignMentor}=require("../controllers/MentorControler");
const verifyToken=require("../middleware/authmiddleware");
const isAdmin=require("../middleware/isadminmiddleware");



router.use(verifyToken);

router.get("/get-usercounts",UserCounts);


router.post("/add-mentor",AddMentor);
router.post("/store-lecture",StoreLectures);
router.post("/add-teacher",AddTeacher);

router.put("/assign-mentors",AssignMentor);

module.exports = router;