const mongoose = require("mongoose");

const blockedTimeSchema = new mongoose.Schema(
  {
    barber: {
      type: String,
      required: true,
      enum: ["bruno", "santi"],
    },

    date: {
      type: String,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BlockedTime", blockedTimeSchema);