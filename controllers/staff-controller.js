require("dotenv").config();
const Staff = require("../models/staff");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const School = require("../models/school");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const getStaff = async (req, res, next) => {
  let staffs;
  try {
    staffs = await Staff.find({}).populate("school");
  } catch (err) {
    const error = new HttpError("Couldn't find staff");
    return next(error);
  }
  res.json(staffs);
};

const getStaffBySchoolId = async (req, res, next) => {
  const schoolId = req.params.schoolId;
  let staffs;
  try {
    staffs = await Staff.find({ schoolId }).populate("school");
  } catch (err) {
    const error = new HttpError("Couldn't find staff (Wrong School)");
    return next(error);
  }
  res.json(staffs);
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.")
    );
  }
  const {
    staffName,
    staffEmail,
    staffPassword,
    staffClasses,
    staffSubjects,
    schoolId,
    isAdmin,
  } = req.body;

  let existingStaffAdmin;
  try {
    existingStaffAdmin = await Staff.findOne({ staffEmail: staffEmail });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later. findone"
    );
    return next(error);
  }
  if (existingStaffAdmin) {
    const err = new HttpError("Staff exists already, please login instead.");
    return next(err);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(staffPassword, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create staff, please try again.",
      500
    );

    return next(error);
  }

  let schoolObjectId;

  const createdStaffAdmin = new Staff({
    staffName: staffName,
    staffEmail: staffEmail,
    staffPassword: hashedPassword,
    staffClasses: staffClasses,
    staffSubjects: staffSubjects,
    schoolId: schoolId,
    isAdmin: isAdmin,
    school: schoolObjectId,
  });

  try {
    await createdStaffAdmin.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.");
    return next(error);
  }

  let token;
  try {
    token = jwt.sign({ userId: createdStaffAdmin._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
    console.log(token)
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.json({ createdStaffAdmin, token: token });
};

const addStaff = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.")
    );
  }
  const {
    staffName,
    staffEmail,
    staffPassword,
    staffClasses,
    staffSubjects,
    schoolId,
    isAdmin,
  } = req.body;

  let existingStaff;
  try {
    existingStaff = await Staff.findOne({ staffEmail: staffEmail });
  } catch (err) {
    const error = new HttpError("Adding staff failed, please try again later.");
    return next(error);
  }
  if (existingStaff) {
    const err = new HttpError("Staff exists already!!!");
    return next(err);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(staffPassword, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create staff, please try again.",
      500
    );

    return next(error);
  }

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

  const createdStaff = new Staff({
    staffName: staffName,
    staffEmail: staffEmail,
    staffPassword: hashedPassword,
    staffClasses: staffClasses,
    staffSubjects: staffSubjects,
    schoolId: schoolId,
    isAdmin: isAdmin,
    school: schoolObjectId,
  });

  try {
    await createdStaff.save();
  } catch (err) {
    const error = new HttpError("Adding staff failed, please try again.");
    return next(error);
  }

  res.status(201).json(createdStaff.isAdmin);
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.")
    );
  }
  const { staffEmail, staffPassword } = req.body;
  let exisitingStaff;
  try {
    exisitingStaff = await Staff.findOne({ staffEmail: staffEmail });
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again.");
    return next(error);
  }

  if (!exisitingStaff) {
    const error = new HttpError("Invalid Credentials, could not log you in");
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(
      staffPassword,
      exisitingStaff.staffPassword
    );
  } catch (err) {
    const error = new HttpError("logging in failed, please try again.");
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials, could not log you in!");
    return next(error);
  }
  let token;
  try {
    token = jwt.sign({ userId: exisitingStaff._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
  } catch (err) {
    console.log(err)
    const error = new HttpError("Logging in failed, please try again.", 500);
    return next(error);
  }

  res.json({ exisitingStaff, token: token });
};

const deleteStaff = async (req, res, next) => {
  const staffId = req.params.staffId;
  let staff;
  try {
    staff = await Staff.findById(staffId);
  } catch (err) {
    const error = new HttpError("Couldn't find staff, please try again.");
    return next(error);
  }

  if (!staff) {
    const error = new HttpError("Staff does not exist", 404);
    return next(error);
  }

  try {
    await staff.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete staff.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Staff Deleted." });
};

exports.signup = signup;
exports.addStaff = addStaff;
exports.login = login;
exports.getStaff = getStaff;
exports.getStaffBySchoolId = getStaffBySchoolId;

exports.deleteStaff = deleteStaff;
