const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student-controller");
const checkAuth = require("../middleware/check-auth")


router.post("/login", studentController.login);

router.use(checkAuth)

router.post("/", studentController.addStudent);
router.delete("/:studentId", studentController.deleteStudent)
router.get("/:studentId", studentController.getStudentById)
router.get("/:schoolId/:studentClass", studentController.getStudentsBySchoolId);

module.exports = router;
