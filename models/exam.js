
const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    examTitle: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    fileUrlExam: { type: String, required: true },

},{ timestamps: true });

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;