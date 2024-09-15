// routes/route.js
const express = require('express');
const { uploadPDF, getUniqueJobs, getJobDetails, calculateScore,calculateCourse} = require('../controllers/detailsUploadController'); // Make sure this path is correct
const { upload } = require('../middleware/multerconfig'); // Make sure this path is correct

const router = express.Router();

// POST route to upload a PDF file
router.post('/upload', upload.single('file'), uploadPDF);
router.get('/unique-jobs',getUniqueJobs);
router.get('/getdetails',getJobDetails)
router.get('/calculateScore',calculateScore)
router.get('/calculateCourse',calculateCourse)      
module.exports = router; // Correctly exporting the router
