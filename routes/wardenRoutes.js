const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getWardenInfoController,
  updateProfileController,
  getWardenByIdController,
  allLeaveRequestController,
  updateStatusController,
} = require("../controllers/wardenCtrl");

const router = express.Router();

//Post SINGLE WARDEN INFO
router.post("/getWardenInfo", authMiddleware, getWardenInfoController);

//post UPDATE PROFILE
router.post("/updateProfile", authMiddleware, updateProfileController);

//POST GET SINGLE WARDEN DETAILS
router.post("/getWardenById", authMiddleware, getWardenByIdController);

//GET ALL LEAVE REQUEST
router.get("/leave-requests", authMiddleware, allLeaveRequestController);

//POST Update Status
router.post("/update-status", authMiddleware, updateStatusController);

module.exports = router;
