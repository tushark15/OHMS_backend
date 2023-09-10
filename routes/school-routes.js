const express = require("express");
const router = express.Router();
const School = require("../models/school");
const schoolController = require("../controllers/school-controller")


router.post("/", schoolController.addSchool);
router.get("/:schoolId", schoolController.getSchool);

module.exports = router;
