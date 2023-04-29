const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const wardenModel = require("../models/wardernModel");
const leaverequestModel = require("../models/leaverequestModel");

//register callback
const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Sucessfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

// login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invlid Email or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .status(200)
      .send({ message: "Login Successfully", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

//Apply Warden Controller
const applyWardenController = async (req, res) => {
  try {
    const newWarden = await wardenModel({ ...req.body, status: "pending" });
    await newWarden.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-warden-request",
      message: `${newWarden.firstName} ${newWarden.lastName} Has Applied for  A Warden Account`,
      data: {
        wardenId: newWarden._id,
        name: newWarden.firstName + " " + newWarden.lastName,
        onclickPath: "/admin/wardens",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Warden Account Applied Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Applying For Warden",
    });
  }
};

//notification controller
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification || [];
    const notification = user.notification || [];
    seennotification.push.apply(seennotification, notification);
    user.notification = [];
    user.seennotification = seennotification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "error in notification",
      success: false,
      error,
    });
  }
};

//deleteAllNotification controller
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted Successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
};

//GET ALL WARDEN
const getAllWardensController = async (req, res) => {
  try {
    const wardens = await wardenModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctor Lists Fetched Successfully",
      data: wardens,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Doctor",
    });
  }
};

//request - leave

const leaveRequestController = async (req, res) => {
  try {
    req.body.status = "pending";
    const newLeaverequest = new leaverequestModel(req.body);
    await newLeaverequest.save();
    const user = await userModel.findOne({ _id: req.body.wardenInfo.userId });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    if (!user.notification) {
      user.notification = [];
    }
    user.notification.push({
      type: "New-leave-request",
      message: `A New Leave Request From ${req.body.userInfo.name}`,
      onClickPath: "user/leaves",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Leave Request Submit Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Request Leave",
    });
  }
};

const userLeavesController = async (req, res) => {
  try {
    const leaves = await leaverequestModel.find({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Users Leaves Fetch Successfully",
      data: leaves,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Leaves",
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  applyWardenController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllWardensController,
  leaveRequestController,
  userLeavesController,
};
