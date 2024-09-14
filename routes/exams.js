const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");
const multer = require("multer");

// Configure storage for multer
let filename = "";
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, callback) => {
    let date = Date.now();
    let fl = date + "." + file.mimetype.split("/")[1];
    callback(null, fl);
    filename = fl;
  },
});
const upload = multer({ storage: storage });

// Middleware to attach filename to request
const setFilenameMiddleware = (req, res, next) => {
  req.filename = filename;
  filename = ""; // Reset after use
  next();
};

// Define routes
router.get("/getExams", examController.getExams);

router.get("/getExamById/:id", examController.getExamById);

router.delete("/deleteExam/:id", examController.deleteExamById);

router.post("/addExam", upload.any("file"), setFilenameMiddleware, examController.addExam);

module.exports = router;
