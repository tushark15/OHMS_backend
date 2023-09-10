const Student = require("../models/student");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

const addStudent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.")
    );
  }
  const {
    studentName,
    studentEmail,
    studentContact,
    studentAddress,
    studentId,
    studentDOB,
    studentClass,
    schoolId,
  } = req.body;

  let existingStudent;
  try {
    existingStudent = await Student.findOne({ studentEmail: studentEmail });
  } catch (err) {
    const error = new HttpError(
      "Adding Student failed, please try again later."
    );
    return next(error);
  }
  if (existingStudent) {
    const err = new HttpError("Student exists already!!!");
    return next(err);
  }

  const createdStudent = new Student({
    studentName,
    studentEmail,
    studentContact,
    studentAddress,
    studentId,
    studentDOB,
    studentClass,
    schoolId,
  });

  try {
    await createdStudent.save();
  } catch (err) {
    const error = new HttpError("Adding student failed, please try again.");
    return next(error);
  }

  res.status(201).json(createdStudent.studentId);
};

const getStudentsBySchoolId = async (req, res, next) => {
  const schoolId = req.params.schoolId;
  const studentClass = req.params.studentClass;
  let students;
  try {
    students = await Student.find({ schoolId: schoolId, studentClass: studentClass});
  } catch (err) {
    const error = new HttpError("Couldn't find Students (Wrong School)");
    return next(error);
  }
  res.json(students);
};

exports.addStudent = addStudent;
exports.getStudentsBySchoolId = getStudentsBySchoolId;
