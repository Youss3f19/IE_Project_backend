const Exam = require("../models/exam");
const path = require("path");
const fs = require("fs"); // Import the 'fs' module

// Fetch all exams
exports.getExams = async (req, res, next) => {
  try {
    const exams = await Exam.find();
    res.status(200).json({
      message: "Exams fetched successfully",
      exams: exams,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching exams",
      error: err.message,
    });
    next(err);
  }
};

// Fetch single exam by ID and download file
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const filePath = path.join(__dirname, "../uploads", exam.fileUrlExam);

    res.download(filePath, (err) => {
      if (err) {
        console.log("Error in downloading the file: ", err);
        return res.status(500).send({
          message: "Error downloading the file",
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      message: "Error downloading file",
      error: err.message,
    });
  }
};

// Delete exam by ID
exports.deleteExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Path to the file
    const filePath = path.join(__dirname, "../uploads", exam.fileUrlExam);

    // Delete the file from the uploads folder
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting the file: ", err);
        return res.status(500).json({
          message: "Error deleting the file from the server",
          error: err.message,
        });
      }
    });

    // Delete the exam record from the database
    await Exam.deleteOne({ _id: req.params.id });
    res.send("Exam deleted");
  } catch (err) {
    res.status(500).json({
      message: "Error deleting exam",
      error: err.message,
    });
  }
};

// Add new exam
exports.addExam = (req, res) => {
  let data = req.body;
  let exam = new Exam(data);
  exam.fileUrlExam = req.filename;

  exam
    .save()
    .then((exam) => {
      res.status(200).send(exam);
    })
    .catch((err) =>
      res.status(500).json({
        message: "Error adding file",
      })
    );
};
