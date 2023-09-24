const express = require("express");
const router = express.Router();
const homeworkController = require("../controllers/homework-controller")
const checkAuth = require("../middleware/check-auth")
const multer = require("multer");
const upload = multer({dest: "uploads/homework"});


router.use(checkAuth)
router.post("/", upload.single("homework"), homeworkController.addHomework);

module.exports = router;
