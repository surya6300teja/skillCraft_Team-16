const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Course schema
const courseSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    Course_Name: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Create the Course model
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
