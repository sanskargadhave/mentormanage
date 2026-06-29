const express =require("express");
const router=express.Router();

const {UserCounts}=require("../controllers/AdminControler");

const {StoreLectures} =require("../controllers/LectureControler");

const {AssignMentor}=require("../controllers/MentorControler");
const verifyToken=require("../middleware/authmiddleware");
const isAdmin=require("../middleware/isadminmiddleware");
const getNotification =require("../controllers/notificationControler");


router.use(verifyToken,isAdmin);

router.get("/get-usercounts",UserCounts);
router.get("/get-notifications/:id",getNotification);
router.post("/store-lecture",StoreLectures);


router.put("/assign-mentors",AssignMentor);

module.exports = router;