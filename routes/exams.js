const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");
const { upload } = require("../middleware/multerMiddleware");
const authorize = require("../middleware/authorize");
const auth = require("../middleware/auth");

// Define routes
router.get("/getExams", examController.getExams);
router.get("/getAcceptedExams", examController.getAcceptedExams);
router.get("/getPendExams", auth, authorize(["admin"]), examController.getPendExams);
router.get("/getExamById/:id", examController.getExamById);
router.get("/getExamDetailsById/:id", examController.getExamDetailsById);
router.get("/getExamsByClasse/:classe", examController.getExamsByClass);

router.delete("/deleteExam/:id", auth, authorize(["admin"]), examController.deleteExamById);

router.put("/updateExam/:id", auth, upload.single("file"), examController.updateExam);
router.put("/acceptOrRejectExam/:id", auth, authorize(["admin"]), examController.acceptOrRejectExam);


// Add exam route with file upload
router.post("/addExam", auth, upload.single("file"), examController.addExam);

module.exports = router;
