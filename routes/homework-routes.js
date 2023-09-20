const express = require("express");
const router = express.Router();
const homeworkController = require("../controllers/homework-controller")

router.post("/", homeworkController.addHomework);

module.exports = router;
