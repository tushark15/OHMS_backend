const Homework = require("../models/homework");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const School = require("../models/school");
const Staff = require("../models/staff");
const { uploadFile } = require("../s3");

const getHomework = async (req, res, next) => {
  let homework;
  try {
    homework = await Homework.find({});
  } catch (err) {
    const error = new HttpError("Fetching homework failed, try again later.", 500);
    return next(error);
  }
  res.json(homework);
}

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

  console.log(req.file);

  try {
    const result = await uploadFile(req.file);
    // console.log(result);
  } catch (err) {
    console.log(err);
  }

  let schoolObjectId;

  try {
    const school = await School.findOne({ schoolId: schoolId });
    if (!school) {
      const error = new HttpError("Error finding school.", 500);
      return next(error);
    }
    schoolObjectId = school._id; // Obtain the ObjectId of the school
  } catch (err) {
    const error = new HttpError("Error finding school.", 500);
    return next(error);
  }

  let staffObjectId;
  // console.log(staffId)

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
    homework: req.file.filename,
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
    const error = new HttpError("Fetching homework failed, try again later.", 500);
    console.log(err)
    return next(error);
  }
  res.json(homeworks);
}

const getHomeworkById = async (req, res, next) => {
  const homeworkId = req.params.homeworkId;
  let homework;
  try {
    homework = await Homework.findById(homeworkId);
  } catch (err) {
    const error = new HttpError("Fetching homework failed, try again later.", 500);
    return next(error);
  }
  res.json(homework.homework);
}

exports.addHomework = addHomework;
exports.getHomework = getHomework;
exports.getHomeworkBySchoolIdAndClass = getHomeworkBySchoolIdAndClass;
exports.getHomeworkById = getHomeworkById;
