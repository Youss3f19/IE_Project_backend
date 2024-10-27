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

// Fetch exams by class
exports.getExamsByClass = async (req, res, next) => {
  try {
    const { classe } = req.params; 
    const exams = await Exam.find({ classe , accepted: true }); 
    if (exams.length === 0) {
      return res.status(404).json({
        message: "No exams found for the specified class",
      });
    }
    res.status(200).json({
      message: "Exams fetched successfully",
      exams: exams,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching exams by class",
      error: err.message,
    });
    next(err);
  }
};


// Fetch all accepted exams
exports.getPendExams = async (req, res, next) => {
  try {
    const exams = await Exam.find({ accepted: false }).populate('addedBy', 'name lastname email'); // Populate with user's full name and email
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


// fetch lexamanet li mezelou matkeblouch
exports.getAcceptedExams = async (req, res, next) => {
  try {
    const exams = await Exam.find({ accepted: true });
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

// Accept or pend an exam by ID
exports.acceptOrRejectExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Vérifier si le champ 'accepted' est fourni dans la requête
    const { accepted } = req.body;
    
    if (accepted === undefined) {
      return res.status(400).json({ message: "'accepted' field is required" });
    }

    // Mettre à jour l'état de l'examen
    exam.accepted = accepted; // true pour accepter, false pour rejeter
    await exam.save();

    res.status(200).json({
      message: accepted ? "Exam accepted successfully" : "Exam rejected successfully",
      exam: exam,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating exam status",
      error: err.message,
    });
    next(err);
  }
};




// Fetch single exam by ID without download file

exports.getExamDetailsById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Return the exam details without downloading the file
    return res.json(exam);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching exam details",
      error: err.message,
    });
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

      // After deleting the file, delete the exam record from the database
      Exam.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({ message: "Exam deleted successfully" });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Error deleting exam from the database",
            error: err.message,
          });
        });
    });
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

  const addedBy = req.user;  

  let exam = new Exam({
    ...data,
    fileUrlExam: req.filename,
    addedBy: addedBy,
  });

  exam
    .save()
    .then((exam) => {
      res.status(200).send(exam);
    })
    .catch((err) =>
      res.status(500).json({
        message: "Error adding file",
        error: err.message
      })
    );
};

exports.updateExam = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the existing exam
    const exam = await Exam.findById(id);
    
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Update fields based on request body
    exam.examTitle = req.body.examTitle || exam.examTitle;
    exam.subject = req.body.subject || exam.subject;
    exam.examYear  = req.body.examYear || exam.examYear;
    exam.classe = req.body.classe || exam.classe;


    // Handle file upload if a new file is provided
    if (req.file) {
      // Delete the old file if it exists
      const oldFilePath = path.join(__dirname, "../uploads", exam.fileUrlExam);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      // Update the file URL to the new file's name
      exam.fileUrlExam = req.file.filename; // Assuming req.file.filename contains the new filename
    }

    // Save the updated exam
    await exam.save();

    res.status(200).json({ message: "Exam updated successfully", exam });
  } catch (err) {
    res.status(500).json({
      message: "Error updating exam",
      error: err.message,
    });
  }
};