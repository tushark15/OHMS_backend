const Homework = require("../models/homework");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const School = require("../models/school");
const Staff = require("../models/staff");

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
    homework,
    note,
    schoolId,
  } = req.body;

  let schoolObjectId;

  try {
    const school = await School.findOne({ schoolId: schoolId });
    if (!school) {
      // Handle the case where the corresponding school is not found
      // You can return an error response or handle it as needed
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
      // Handle the case where the corresponding school is not found
      // You can return an error response or handle it as needed
    }
    staffObjectId = staff._id;
    console.log(staffObjectId); // Obtain the ObjectId of the school
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
    homework,
    note,
    schoolId,
    school: schoolObjectId,
  });

  console.log(createdHomework); // Obtain the ObjectId of the

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

exports.addHomework = addHomework;
