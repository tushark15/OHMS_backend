const express = require("express");
const router = express.Router();
const Student = require("../models/student");

router.get("/", async (req, res) => {
  try {
    const student = await Student.find();
    res.json(student);
  } catch (err) {
    console.log({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const student = new Student({
    studentName: req.body.studentName,
    studentEmail: req.body.studentEmail,
    studentContact: req.body.studentContact,
    studentAddress: req.body.studentAddress,
    studentId: req.body.studentId,
    studentDOB: req.body.studentDOB,
    studentClass: req.body.studentClass,
  });
  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports= router;
