const mongoose = require("mongoose");
const { Schema } = mongoose;

const ActivitySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["CREATE_REPO", "STAR_REPO", "COMMIT", "CREATE_ISSUE"],
      required: true,
    },
    repository: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model("Activity", ActivitySchema);

module.exports = Activity;