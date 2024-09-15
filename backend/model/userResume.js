const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: false },
    parsedData: { type: mongoose.Schema.Types.Mixed, required: true }
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;

