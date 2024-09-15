const fs = require('fs');
const pdfParse = require('pdf-parse');
const dotenv = require('dotenv');
const Resume = require('../model/userResume'); // Update the path to where your Resume model is located
const JobDescription = require('../model/descriptionmodel'); // Update the path to where your JobDescription model is located
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Course = require('../model/courses');

dotenv.config();

// Controller for uploading and parsing a PDF file
const uploadPDF = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: 'No file uploaded or the file format is incorrect. Please upload a PDF.'
        });
    }

    try {
        const pdfFilePath = req.file.path;
        const dataBuffer = fs.readFileSync(pdfFilePath);

        // Parse the PDF
        const data = await pdfParse(dataBuffer);
        const extractedText = data.text;

        // Save the extracted text to the Resume model
        const resume = new Resume({
            // userId: false,  // Default value for userId
            parsedData: extractedText
        });
        await resume.save();

        return res.status(200).json({
            message: 'File uploaded, parsed, and resume saved successfully!',
            filePath: `/uploads/${req.file.filename}`,
            extractedText: extractedText
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error processing the file.',
            error: error.message
        });
    }
};

// Controller for fetching unique job titles
const getUniqueJobs = async (req, res) => {
    try {
        const uniqueJobs = await JobDescription.distinct('JOB');
        res.status(200).json({
            message: 'Unique JOB values fetched successfully!',
            uniqueJobs: uniqueJobs
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching unique JOB values.',
            error: error.message
        });
    }
};

// Controller for fetching job details by job title
const getJobDetails = async (req, res) => {
    const { jobTitle } = req.body;

    if (!jobTitle) {
        return res.status(400).json({
            message: 'Job title is required.'
        });
    }

    try {
        const jobDetails = await JobDescription.find({ JOB: jobTitle });

        if (jobDetails.length === 0) {
            return res.status(404).json({
                message: 'No job details found for the given job title.'
            });
        }

        res.status(200).json({
            message: 'Job details fetched successfully!',
            jobDetails: jobDetails
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching job details.',
            error: error.message
        });
    }
};

// Controller for calculating the score based on resume data and job title
const calculateScore = async (req, res) => {
    const { resumeId, jobid } = req.body;

    if (!resumeId || !jobid) {
        return res.status(400).json({
            message: 'Resume ID and job title are required.'
        });
    }

    try {
        // Fetch resume details
        const resume = await Resume.findById(resumeId);
        if (!resume) {
            return res.status(404).json({
                message: 'Resume not found.'
            });
        }

        const job = await JobDescription.findById(jobid);
        if (!job) {
            return res.status(404).json({
                message: 'Resume not found.'
            });
        }
        const parsedResumeData = resume.parsedData;

        // Initialize Google Generative AI
        const apiKey = process.env.GEMINI_KEY;
        if (!apiKey) {
            return res.status(500).json({
                message: 'API key is missing.'
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Evaluate the following resume data against the job description titled "${JSON.stringify(job)}". Provide a score on how well the resume matches the job description.STRICTLY GIVE A NUMBER BETWEEN 0 to 100 ONLY.DO NOT GIVE ANY TEXT GIVE NUMBER ONLY. Resume Data: ${JSON.stringify(parsedResumeData)}`;

        // Send request to Gemini API
        const result = await model.generateContent(prompt);

        // Parse the result
        let score;
        try {
            const responseText = result.response.text();
            console.log(responseText)
            score = parseFloat(responseText); // Assuming the API returns a numeric score
        } catch (parseError) {
            return res.status(500).json({
                message: 'Error parsing the AI response.',
                error: parseError.message
            });
        }

        res.status(200).json({
            message: 'Score fetched successfully!',
            score: score
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error processing the request.',
            error: error.message
        });
    }
};





const calculateCourse = async (req, res) => {
    const { resumeId, jobid } = req.body;

    if (!resumeId || !jobid) {
        return res.status(400).json({
            message: 'Resume ID and job ID are required.'
        });
    }

    try {
        // Fetch resume details
        const resume = await Resume.findById(resumeId);
        if (!resume) {
            return res.status(404).json({
                message: 'Resume not found.'
            });
        }

        // Fetch job description details
        const job = await JobDescription.findById(jobid);
        if (!job) {
            return res.status(404).json({
                message: 'Job description not found.'
            });
        }

        // Fetch all courses and extract titles
        const courses = await Course.find().select('Course_Name');
        if (courses.length === 0) {
            return res.status(404).json({
                message: 'No courses found.'
            });
        }

        const parsedResumeData = resume.parsedData;

        // Initialize Google Generative AI
        const apiKey = process.env.GEMINI_KEY;
        if (!apiKey) {
            return res.status(500).json({
                message: 'API key is missing.'
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Construct the prompt for the AI model
        const prompt = `Evaluate the following resume data against the job description titled "${JSON.stringify(job)}". Provide me only one course name which is useful after analyzing this job description and resume ${JSON.stringify(parsedResumeData)}. Return the course title from this list only: ${JSON.stringify(courses)}. Return only the name of the course and no other text.`;

        // Send request to Gemini API
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();

        // Respond with the course title
        res.status(200).json({
            message: 'Course fetched successfully!',
            course: responseText
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error processing the request.',
            error: error.message
        });
    }
};







// Export the controllers
module.exports = { uploadPDF, getUniqueJobs, getJobDetails, calculateScore, calculateCourse };
