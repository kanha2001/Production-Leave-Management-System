const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUsersController,
  getAllWardensController,
  changeAccountStatusController,
} = require("../controllers/adminCtrl");
//router object
const router = express.Router();

//Get Method || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

//Get Method || WARDENS
router.get("/getAllWardens", authMiddleware, getAllWardensController);

//Post Account Status
router.post(
  "/changeAccountStatus",
  authMiddleware,
  changeAccountStatusController
);

module.exports = router;
