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
    type:{
        type: String,
        required: false,
        num : ['DS' , 'Exam']
    },
    classe:{
        type: String,
        required: true,
    },
    examYear:{
        type: String,
        required: true,  
    },
    fileUrlExam: { 
        type: String, 
        required: true 
    },
    accepted: {
        type: Boolean,
        default: false,
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    }
}, { timestamps: true });

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
