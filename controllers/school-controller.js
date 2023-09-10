const School = require("../models/school");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

const addSchool = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    schoolName,
    schoolAddress,
    schoolEmail,
    schoolEmailSuffix,
    schoolContact,
    schoolClasses,
    classSubjects,
    schoolId,
  } = req.body;

  let exisitingSchool;
  try {
    exisitingSchool = await School.findOne({ schoolId: schoolId });
  } catch (err) {
    const error = new HttpError(
      "Add unique schoolId, domain and email address",
      500
    );
    return next(error);
  }

  if (exisitingSchool) {
    const error = new HttpError("School exists already", 422);
    return next(error);
  }

  const createdSchool = new School({
    schoolName,
    schoolAddress,
    schoolEmail,
    schoolEmailSuffix,
    schoolContact,
    schoolClasses,
    classSubjects,
    schoolId,
  });

  try {
    await createdSchool.save();
  } catch (err) {
    const error = new HttpError(
      "Creating School failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    schoolClasses: createdSchool.schoolClasses,
    classSubjects: createdSchool.classSubjects,
    schoolId: createdSchool.schoolId
  });
};

const getSchool = async (req, res, next) => {
  const schoolId = req.params.schoolId;
  let school;
  try {
    school = await School.findOne({schoolId: schoolId});
  } catch (err) {
    const error = new HttpError(
      "Finding School Failed, please try again later.",
      500
    );
    return next(error);
  }

  if(!school){
    const error = new HttpError(
        "Could not find the school with provided id.",
        404
      );
      return next(error);
  }
  res.json(school);
};

exports.addSchool = addSchool;
exports.getSchool = getSchool;
