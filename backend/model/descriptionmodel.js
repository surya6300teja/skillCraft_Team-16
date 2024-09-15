const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
  SR_NO: { type: String, default: "" },
  JOB: { type: String, required: true },
  JOB_ROLE: { type: String },
  START_DATE: { type: String },
  LAST_DATE: { type: String },
  PRESENT_APPLICANTS: { type: Number },
  DOMAIN: { type: String },
  JOB_TITLE: { type: String },
  JOB_SECTOR: { type: String },
  JOB_SKILLS: { type: String },
  JOB_TIMINGS: { type: String },
  JOB_TYPE: { type: String },
  COMPANY_NAME: { type: String },
  COMPANY_TYPE: { type: String },
  JOB_LOCATION: { type: String },
});

const JobDescription = mongoose.model('jobdescriptions', jobDescriptionSchema);

module.exports = JobDescription;
