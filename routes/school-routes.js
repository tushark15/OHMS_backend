const express = require("express");
const router = express.Router();
const School = require("../models/school");
const schoolController = require("../controllers/school-controller")

router.get("/:schoolId", schoolController.getSchool);

router.post("/", schoolController.addSchool);

module.exports = router;
