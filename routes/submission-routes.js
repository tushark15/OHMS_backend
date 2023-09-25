const submissionController = require('../controllers/submission-controller');
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/submission' });

router.use(checkAuth);
router.get('/', submissionController.getSubmission);
router.post('/', upload.single('submission'), submissionController.addSubmission);
router.get("/download/:submissionId", submissionController.getSubmissionById);
router.get("/:studentId", submissionController.getSubmissionByStudentId);

module.exports = router;