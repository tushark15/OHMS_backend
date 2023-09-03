const express = require("express");
const router = express.Router();
const Staff = require("../models/staff");
const staffController = require("../controllers/staff-controller")

router.get("/", staffController.getStaff);
router.get("/:schoolId", staffController.getStaffBySchoolId);

router.post("/signup", staffController.signup)
router.post("/addStaff", staffController.addStaff)
router.delete("/:staffId", staffController.deleteStaff)

router.post("/login", staffController.login)

module.exports = router;
