const express = require("express");
const router = express.Router();
const schoolController = require("../controllers/school-controller")
const checkAuth = require("../middleware/check-auth")


router.use(checkAuth);

router.post("/", schoolController.addSchool);
router.get("/:schoolId", schoolController.getSchool);

module.exports = router;
