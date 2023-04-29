const mongoose = require("mongoose");

const leaverequestSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    wardenId: {
      type: String,
      required: true,
    },
    wardenInfo: {
      type: String,
      required: true,
    },
    userInfo: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    time: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

const leaverequestModel = mongoose.model("leaverequests", leaverequestSchema);

module.exports = leaverequestModel;
