const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const studentController = require("../controllers/student-controller");

router.post("/", studentController.addStudent);
router.get("/:schoolId/:studentClass", studentController.getStudentsBySchoolId);

module.exports = router;
