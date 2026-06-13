const express =require("express");
const verifyToken =require("../middleware/authmiddleware");
const router=express.Router();
const {getProfiledetails,updateProfiledetails}=require("../controllers/ProfileControler");


router.get("/get-profiledetails/:id",getProfiledetails);
router.put("/updateprofile-details",updateProfiledetails);

module.exports=router;