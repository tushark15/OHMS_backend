const Submission = require("../models/submission");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const School = require("../models/school");
const Student = require("../models/student");
const { uploadFile, getFileStream } = require("../s3");
const Homework = require("../models/homework");

const getSubmission = async (req, res, next) => {
  let submission;
  try {
    submission = await Submission.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching submission failed, try again later.",
      500
    );
    return next(error);
  }
  res.json(submission);
};

const addSubmission = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    schoolClass,
    classSubject,
    uploadDate,
    studentId,
    note,
    schoolId,
    homeworkId,
  } = req.body;

  const fileType = req.file.mimetype.split("/")[1];

  const fileSize = req.file.size; 

  const maxFileSizeBytes = 5 * 1024 * 1024; // 2MB in bytes

  if (fileSize > maxFileSizeBytes) {
    return next(
      new HttpError("File size exceeds the maximum allowed size.", 422)
    );
  }

  let result;

  try {
    result = await uploadFile(req.file);
    if (result) {
      console.log("File uploaded successfully:", result);
    } else {
      console.log("File upload failed.");
    }
  } catch (err) {
  }
  result = result.key + "." + fileType;

  try {
    const school = await School.findOne({ schoolId: schoolId });
    if (!school) {
      const error = new HttpError("Error finding school.", 500);
      return next(error);
    }
    schoolObjectId = school._id;
  } catch (err) {
    const error = new HttpError("Error finding school.", 500);
    return next(error);
  }

  let studentObjectId;
  try {
    const student = await Student.findOne({ studentId: studentId });
    if (!student) {
      const error = new HttpError("Error finding student.", 500);
      return next(error);
    }
    studentObjectId = student._id;
  } catch (err) {
    const error = new HttpError("Error finding student.", 500);
    return next(error);
  }

  let homeworkObjectId;
  try {
    const homework = await Homework.findById(homeworkId);
    if (!homework) {
      const error = new HttpError("Error finding homework.", 500);
      return next(error);
    }
    homeworkObjectId = homework._id;
  } catch (err) {
    const error = new HttpError("Error finding homework.", 500);
    return next(error);
  }

  const createdSubmission = new Submission({
    schoolClass,
    classSubject,
    uploadDate,
    studentId,
    submission: result,
    note,
    schoolId,
    school: schoolObjectId,
    student: studentObjectId,
    homework: homeworkObjectId,
  });

  try {
    await createdSubmission.save();
  } catch (err) {
    const error = new HttpError(
      "Creating submission failed, please try again.",
      500
    );

    return next(error);
  }

  res.status(201).json({ submission: createdSubmission });
};

const getSubmissionByStudentId = async (req, res, next) => {
  const studentId = req.params.studentId;
  let submissions;
  try {
    submissions = await Submission.find({ studentId: studentId });
  } catch (err) {
    const error = new HttpError(
      "Fetching submission failed, try again later.",
      500
    );
    return next(error);
  }
  res.json(submissions);
};

const getSubmissionById = async (req, res, next) => {
  const submissionId = req.params.submissionId;
  let submission;
  try {
    submission = await Submission.findById(submissionId);
    if (!submission) {
      const error = new HttpError("Submission not found.", 404);
      return next(error);
    }
    const submissionURL = submission.submission.split(".")[0];
    const fileStream = getFileStream(submissionURL);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${submission.submission}`
    );
    res.setHeader("Content-Type", "application/octet-stream");
    fileStream.pipe(res);
    
  } catch (err) {
    const error = new HttpError(
      "Fetching submission failed, try again later.",
      500
    );
    return next(error);
  }
};


exports.getSubmission = getSubmission;
exports.addSubmission = addSubmission;
exports.getSubmissionByStudentId = getSubmissionByStudentId;
exports.getSubmissionById = getSubmissionById;
