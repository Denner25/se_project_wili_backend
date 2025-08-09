const mongoose = require("mongoose");
const validator = require("validator");

const itemSchema = new mongoose.Schema(
  {
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
      type: String, // e.g. "120 min" or "12 ep • 24 min"
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    tmdbId: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
