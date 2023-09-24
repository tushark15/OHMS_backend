const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staff-controller")
const checkAuth = require("../middleware/check-auth")



router.post("/signup", staffController.signup)
router.post("/login", staffController.login)

router.use(checkAuth);
router.get("/", staffController.getStaff);
router.post("/addStaff", staffController.addStaff)
router.get("/:schoolId", staffController.getStaffBySchoolId);
router.delete("/:staffId", staffController.deleteStaff)


module.exports = router;
