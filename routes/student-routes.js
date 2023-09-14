const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const studentController = require("../controllers/student-controller");

router.post("/", studentController.addStudent);
router.post("/login", studentController.login);
router.delete("/:studentId", studentController.deleteStudent)
router.get("/:studentId", studentController.getStudentById)
router.get("/:schoolId/:studentClass", studentController.getStudentsBySchoolId);

module.exports = router;
