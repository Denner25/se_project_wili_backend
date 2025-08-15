const Item = require("../models/items");
const { importTmdbItem } = require("../utils/tmdb");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const NotFoundError = require("../errors/not-found-err");
const {
  handleValidationAndCastError,
  handleCastAndNotFoundError,
} = require("../utils/constants");
const { fetchTmdbKeywords } = require("../utils/tmdb");

// GET all items (public)
const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.status(ERROR_CODES.OK).send({ data: items }))
    .catch(next);
};

// GET current user's items (private)
const getUserItems = (req, res, next) => {
  Item.find({ "moods.users": req.user._id })
    .then((items) => res.status(ERROR_CODES.OK).send({ data: items }))
    .catch(next);
};

// CREATE new item
const createItem = (req, res, next) => {
  const { _id, title, mediaType, poster, length, moods } = req.body;

  Item.create({
    _id: _id,
    title,
    mediaType,
    poster,
    length,
    moods: Array.isArray(moods)
      ? moods.map((name) => ({ name, users: [] }))
      : [],
  })
    .then((item) => res.status(ERROR_CODES.CREATED).send({ data: item }))
    .catch((err) => handleValidationAndCastError(err, next));
};

// IMPORT from TMDb
const importFromTmdb = (req, res, next) => {
  const { _id, mediaType } = req.body;

  importTmdbItem(_id, mediaType)
    .then((itemData) => {
      const itemToCreate = {
        ...itemData,
        _id: _id,
        moods: [], // fresh moods
      };
      return Item.create(itemToCreate);
    })
    .then((item) => res.status(ERROR_CODES.CREATED).send({ data: item }))
    .catch((err) => handleValidationAndCastError(err, next));
};

// UPDATE basic item fields (title, mediaType, poster, length)
const updateItem = (req, res, next) => {
  const allowedUpdates = ["title", "mediaType", "poster", "length"];
  const updates = {};
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  Item.findById(req.params._id)
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) => {
      Object.assign(item, updates);
      return item.save();
    })
    .then((updatedItem) =>
      res.status(ERROR_CODES.OK).send({ data: updatedItem })
    )
    .catch((err) => handleValidationAndCastError(err, next));
};

// UPDATE moods (likes-style)
const updateItemMoods = (req, res, next) => {
  const { moods } = req.body; // array of mood names
  const userId = req.user._id;

  Item.findById(req.params._id)
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) => {
      // Remove user from all moods first
      item.moods.forEach((m) => {
        m.users = m.users.filter((id) => id.toString() !== userId.toString());
      });

      // Add user to selected moods
      if (Array.isArray(moods)) {
        moods.forEach((moodName) => {
          let existing = item.moods.find((m) => m.name === moodName);
          if (existing) {
            existing.users.push(userId);
          } else {
            item.moods.push({ name: moodName, users: [userId] });
          }
        });
      }

      // Remove moods with no users
      item.moods = item.moods.filter((m) => m.users.length > 0);

      return item.save();
    })
    .then((updatedItem) =>
      res.status(ERROR_CODES.OK).send({ data: updatedItem })
    )
    .catch((err) => handleValidationAndCastError(err, next));
};

// DELETE item (if needed)
const deleteItem = (req, res, next) => {
  Item.findById(req.params._id)
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) =>
      item
        .deleteOne()
        .then(() => res.status(ERROR_CODES.OK).send({ data: item }))
    )
    .catch((err) => handleCastAndNotFoundError(err, next));
};

// TMDb keywords
const getTmdbKeywords = (req, res, next) => {
  const { _id, mediaType } = req.query;
  if (!_id || !mediaType)
    return res.status(400).json({ message: "_id and mediaType are required" });

  fetchTmdbKeywords(_id, mediaType)
    .then((keywords) => res.status(ERROR_CODES.OK).json({ keywords }))
    .catch(next);
};

module.exports = {
  getItems,
  getUserItems,
  createItem,
  importFromTmdb,
  updateItem,
  updateItemMoods,
  deleteItem,
  getTmdbKeywords,
};
