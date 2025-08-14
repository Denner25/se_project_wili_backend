const mongoose = require("mongoose");
const validator = require("validator");

// Subdocument for each mood
const moodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 30 },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { _id: false }
);

const itemSchema = new mongoose.Schema(
  {
    _id: { type: Number, required: true }, // TMDb numeric ID
    title: { type: String, required: true, trim: true },
    mediaType: { type: String, enum: ["movie", "tv", "anime"], required: true },
    poster: {
      type: String,
      default: null,
      validate: {
        validator: (v) => !v || validator.isURL(v),
        message: "Poster must be a valid URL",
      },
    },
    length: { type: String, default: null },
    moods: { type: [moodSchema], default: [] }, // Likes-style
  },
  { timestamps: true, _id: false }
);

module.exports = mongoose.model("Item", itemSchema);
