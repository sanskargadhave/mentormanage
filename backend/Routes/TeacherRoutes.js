const express =require("express");
const router=express.Router();

const {GetTestSummery,MakeTestReport}=require("../controllers/TestControler");
const {StoreAttendances}=require("../controllers/AttendanceControler");
const CreateTestId=require("../middleware/testMiddleware");
const {StoreTest}=require("../controllers/TestControler");
const verifyToken=require("../middleware/authmiddleware");
const isTeacher=require("../middleware/isteachermiddleware");

router.use(verifyToken, isTeacher);
router.get("/make-test-report/:testid",MakeTestReport);
router.get("/get-test-summery/:testid",GetTestSummery);

router.post("/store-attendance",StoreAttendances);
router.post("/store-test-result",CreateTestId,StoreTest);

module.exports = router;
