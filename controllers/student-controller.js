const Student = require("../models/student");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const School = require("../models/school");

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
    studentPassword,
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

  const createdStudent = new Student({
    studentName,
    studentEmail,
    studentContact,
    studentAddress,
    studentId,
    studentDOB,
    studentClass,
    schoolId,
    studentPassword,
    school: schoolObjectId,

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
    students = await Student.find({
      schoolId: schoolId,
      studentClass: studentClass,
    }).populate("school");
  } catch (err) {
    const error = new HttpError("Couldn't find Students (Wrong School)");
    return next(error);
  }
  res.json(students);
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.")
    );
  }
  const { studentId, studentPassword } = req.body;
  let exisitingStudent;

  try {
    exisitingStudent = await Student.findOne({ studentId: studentId });
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again.");
    return next(error);
  }

  if (!exisitingStudent) {
    const error = new HttpError("Invalid Credentials, could not log you in");
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = studentPassword === exisitingStudent.studentPassword;
  } catch (err) {
    const error = new HttpError("logging in failed, please try again.");
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials, could not log you in!");
    return next(error);
  }

  res.json({
    schoolId: exisitingStudent.schoolId,
    studentId: exisitingStudent.studentId,
    studentClass: exisitingStudent.studentClass,
  });
};

const deleteStudent = async (req, res, next) => {
  const studentId = req.params.studentId;
  let student;
  try {
    student = await Student.findById(studentId);
  } catch (err) {
    const error = new HttpError("Couldn't find student, please try again.");
    return next(error);
  }

  if (!student) {
    const error = new HttpError("student does not exist", 404);
    return next(error);
  }

  try {
    await student.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete student.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Student Deleted." });
};

const getStudentById = async (req, res, next) => {
  const studentId = req.params.studentId;
  let student;
  try{
    student = await Student.findOne({studentId: studentId}).populate("school")
  }catch(err){
    const error = new HttpError("Something went wrong, could not find the student", 500);
    return next(error);
  }

  if(!student){
    const error = new HttpError(
      "Could not find the student with provided id.",
      404
    );
    return next(error);
  }
  res.json({
    studentClass: student.studentClass,
    schoolId: student.schoolId
  })
}

exports.addStudent = addStudent;
exports.getStudentsBySchoolId = getStudentsBySchoolId;
exports.login = login;
exports.deleteStudent = deleteStudent;
exports.getStudentById = getStudentById;
