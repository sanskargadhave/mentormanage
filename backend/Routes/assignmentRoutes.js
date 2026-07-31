const express =require("express");
const router=express.Router();
const verifyToken=require("../middleware/authmiddleware");
const isMentor=require("../middleware/ismentormiddleware");
const {addAssignment,getAssignments} =require("../controllers/assignmentControler")
router.use(verifyToken,isMentor);

router.get("/get-assignment-for-mentor",getAssignments);
router.post("/add-assignment",addAssignment);
module.exports=router;
