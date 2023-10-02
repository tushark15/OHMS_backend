const Homework = require("../models/homework");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const School = require("../models/school");
const Staff = require("../models/staff");
const { uploadFile, getFileStream } = require("../s3");

const getHomework = async (req, res, next) => {
  let homework;
  try {
    homework = await Homework.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching homework failed, try again later.",
      500
    );
    return next(error);
  }
  res.json(homework);
};

const addHomework = async (req, res, next) => {
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
    dueDate,
    staffId,
    note,
    schoolId,
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
    const error = new HttpError("Error uploading file.", 500);
    return next(error);
  }
  result = result.key + "." + fileType;

  let schoolObjectId;

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

  let staffObjectId;

  try {
    const staff = await Staff.findById(staffId);
    if (!staff) {
      const error = new HttpError("Error finding staff.", 500);
      return next(error);
    }
    staffObjectId = staff._id;
  } catch (err) {
    const error = new HttpError("Error finding staff.", 500);
    return next(error);
  }

  const createdHomework = new Homework({
    schoolClass,
    classSubject,
    uploadDate,
    dueDate,
    staffId: staffObjectId,
    homework: result,
    note,
    schoolId,
    school: schoolObjectId,
  });

  try {
    await createdHomework.save();
  } catch (err) {
    console.error("Error saving homework:", err);

    const error = new HttpError(
      "Creating Homework failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json(createdHomework);
};

const getHomeworkBySchoolIdAndClass = async (req, res, next) => {
  const schoolId = req.params.schoolId;
  const schoolClass = req.params.schoolClass;
  let homeworks;
  try {
    homeworks = await Homework.find({
      schoolId: schoolId,
      schoolClass: schoolClass,
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching homework failed, try again later.",
      500
    );
    return next(error);
  }
  res.json(homeworks);
};

const getHomeworkById = async (req, res, next) => {
  const homeworkId = req.params.homeworkId;
  let homework;
  try {
    homework = await Homework.findById(homeworkId);
    if (!homework) {
      const error = new HttpError("Homework not found.", 404);
      return next(error);
    }

    const homeworkUrl = homework.homework.split(".")[0];

    // Retrieve the file stream from S3
    const fileStream = getFileStream(homeworkUrl);

    // Set the response headers for downloading the file
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${homework.homework}`
    );
    res.setHeader("Content-Type", "application/octet-stream");

    // Pipe the file stream to the response
    fileStream.pipe(res);
  } catch (err) {
    const error = new HttpError(
      "Fetching homework failed, try again later.",
      500
    );
    return next(error);
  }
};

exports.addHomework = addHomework;
exports.getHomework = getHomework;
exports.getHomeworkBySchoolIdAndClass = getHomeworkBySchoolIdAndClass;
exports.getHomeworkById = getHomeworkById;
