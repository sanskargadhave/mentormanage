const express =require("express");
const router=express.Router();

const {MentorLogin}=require("../controllers/MentorControler");
const {AdminLogin}=require("../controllers/AdminControler");
const {userlogin} = require("../controllers/userControler");

router.post("/mentor-login",MentorLogin);
router.post("/user-login",userlogin);
router.post("/admin-login",AdminLogin);


module.exports = router;
