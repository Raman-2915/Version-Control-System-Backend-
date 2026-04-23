const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommitSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RepositorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    content: [
      {
        type: String,
      },
    ],

    visibility: {
      type: Boolean,
      default: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    issues: [
      {
        type: Schema.Types.ObjectId,
        ref: "Issue",
      },
    ],

    stars: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    commitHistory: [CommitSchema],
  },
  {
    timestamps: true,
  }
);

const Repository = mongoose.model("Repository", RepositorySchema);

module.exports = Repository;