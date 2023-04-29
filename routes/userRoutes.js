const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyWardenController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllWardensController,
  leaveRequestController,
  userLeavesController,
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

//router object
const router = express.Router();

//routes

//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);

//Auth || Post
router.post("/getUserData", authMiddleware, authController);

//Apply Warden || Post
router.post("/apply-warden", authMiddleware, applyWardenController);

//Notification Warden || Post
router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);

//delete Notification Warden || Post
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

//GET ALL WARDEN LIST

router.get("/getAllWardens", authMiddleware, getAllWardensController);

//Leave Request
router.post("/leave-request", authMiddleware, leaveRequestController);

//Leaves Lists
router.get("/user-leaves", authMiddleware, userLeavesController);

module.exports = router;
