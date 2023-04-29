const userModel = require("../models/userModels");
const wardenModel = require("../models/wardernModel");

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "users data list",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while fetching users",
      error,
    });
  }
};

const getAllWardensController = async (req, res) => {
  try {
    const wardens = await wardenModel.find({});
    res.status(200).send({
      success: true,
      message: "Wardens data list",
      data: wardens,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while fetching doctors data",
      error,
    });
  }
};

//doctor account Status
const changeAccountStatusController = async (req, res) => {
  try {
    const { wardenId, status } = req.body;
    const warden = await wardenModel.findByIdAndUpdate(wardenId, { status });
    const user = await userModel.findOne({ _id: warden.userId });
    const notification = user.notification;
    notification.push({
      type: "warden-account-request-updated",
      message: `Your Warden account request Has ${status}`,
      onClickPath: "/notification",
    });
    user.isWarden = status === "approved";
    await user.save();
    res.status(201).send({
      success: true,
      message: "account Status Updated",
      data: warden,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ERROR IN ACCOUNT STATUS",
      error,
    });
  }
};

module.exports = {
  getAllUsersController,
  getAllWardensController,
  changeAccountStatusController,
};
