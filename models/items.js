const mongoose = require("mongoose");
const validator = require("validator");

const itemSchema = new mongoose.Schema(
  {
    _id: {
      // Use TMDb numeric ID as Mongo _id
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    mediaType: {
      type: String,
      enum: ["movie", "tv", "anime"],
      required: [true, "Media type is required"],
    },
    poster: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          return !v || validator.isURL(v);
        },
        message: "Poster must be a valid URL",
      },
    },
    length: {
      type: String,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, _id: false }
);

module.exports = mongoose.model("Item", itemSchema);
