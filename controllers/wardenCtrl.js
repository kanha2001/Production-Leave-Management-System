const leaverequestModel = require("../models/leaverequestModel");
const userModel = require("../models/userModels");
const wardenModel = require("../models/wardernModel");
const getWardenInfoController = async (req, res) => {
  try {
    const warden = await wardenModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Warden Data Fetch Success",
      data: warden,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Warden Details",
    });
  }
};

//update warden profile
const updateProfileController = async (req, res) => {
  try {
    const warden = await wardenModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Warden Profile Updated",
      data: warden,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Warden Profile Update Issue",
    });
  }
};

//Get Single Warden

const getWardenByIdController = async (req, res) => {
  try {
    const warden = await wardenModel.findOne({ _id: req.body.wardenId });
    res.status(200).send({
      success: true,
      message: "Single Warden Info fetched",
      data: warden,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Single Warden Info",
    });
  }
};

const allLeaveRequestController = async (req, res) => {
  try {
    const warden = await wardenModel.findOne({ userId: req.body.userId });
    const leaves = await leaverequestModel.find({
      wardenId: warden._id,
    });
    res.status(200).send({
      success: true,
      message: "Student Leaves fetch Successfully",
      data: leaves,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In All Leave Requests ",
    });
  }
};

const updateStatusController = async (req, res) => {
  try {
    const { leaverequestId, status } = req.body;
    const leaverequest = await leaverequestModel.findByIdAndUpdate(
      leaverequestId,
      { status }
    );
    const user = await userModel.findOne({ _id: leaverequest.userId });
    const notification = user.notification;
    notification.push({
      type: "status-updated",
      message: `Your requested leave status has -  ${status}`,
      onClickPath: "/leave-requests",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Leave Request Status Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Update Status",
    });
  }
};

module.exports = {
  getWardenInfoController,
  updateProfileController,
  getWardenByIdController,
  allLeaveRequestController,
  updateStatusController,
};
