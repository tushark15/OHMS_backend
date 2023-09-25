const Submission = require("../models/submission");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const School = require("../models/school");
const Student = require("../models/student");
const { uploadFile } = require("../s3");
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

  let result;

  try {
    result = await uploadFile(req.file);
    if (result) {
      console.log("File uploaded successfully:", result);
    } else {
      console.log("File upload failed.");
    }
  } catch (err) {
    console.log(err);
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
    console.log(err);
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
    console.log(err);

    return next(error);
  }

  res.status(201).json({ submission: createdSubmission });
};

exports.getSubmission = getSubmission;
exports.addSubmission = addSubmission;
