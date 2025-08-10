const Item = require("../models/items");
const { importTmdbItem } = require("../utils/tmdb.js");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");
const {
  handleValidationAndCastError,
  handleCastAndNotFoundError,
} = require("../utils/constants");
const { fetchTmdbKeywords } = require("../utils/tmdb");

// Get all items (public route)
const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.status(ERROR_CODES.OK).send({ data: items }))
    .catch(next);
};

// Get only current user's items (private route)
const getUserItems = (req, res, next) => {
  Item.find({ owner: req.user._id })
    .then((items) => res.status(ERROR_CODES.OK).send({ data: items }))
    .catch(next);
};

const createItem = (req, res, next) => {
  const { itemId, title, mediaType, poster, length, tags } = req.body;
  Item.create({
    _id: itemId,
    title,
    mediaType,
    poster,
    length,
    tags: tags || [],
    owner: req.user._id,
  })
    .then((item) => res.status(ERROR_CODES.CREATED).send({ data: item }))
    .catch((err) => handleValidationAndCastError(err, next));
};

const importFromTmdb = (req, res, next) => {
  const { itemId, mediaType } = req.body;

  importTmdbItem(itemId, mediaType)
    .then((itemData) => {
      return Item.create(
        Object.assign({}, itemData, { _id: itemId, owner: req.user._id })
      );
    })
    .then((item) => res.status(ERROR_CODES.CREATED).send({ data: item }))
    .catch((err) => handleValidationAndCastError(err, next));
};

const updateItem = (req, res, next) => {
  const allowedUpdates = ["title", "mediaType", "poster", "length"];
  const updates = {};
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  Item.findById(req.params.itemId)
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
      }
      Object.assign(item, updates);
      return item.save();
    })
    .then((updatedItem) =>
      res.status(ERROR_CODES.OK).send({ data: updatedItem })
    )
    .catch((err) => handleValidationAndCastError(err, next));
};

const updateItemTags = (req, res, next) => {
  const { tags } = req.body;
  Item.findByIdAndUpdate(
    req.params.itemId,
    { tags: Array.isArray(tags) ? tags : [] },
    { new: true, runValidators: true }
  )
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
      }
      res.status(ERROR_CODES.OK).send({ data: item });
    })
    .catch((err) => handleValidationAndCastError(err, next));
};

const deleteItem = (req, res, next) => {
  Item.findById(req.params.itemId)
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
      }
      return item
        .deleteOne()
        .then(() => res.status(ERROR_CODES.OK).send({ data: item }));
    })
    .catch((err) => handleCastAndNotFoundError(err, next));
};

// ...existing code...

// Controller to fetch TMDB keywords for a given itemId and mediaType
const getTmdbKeywords = (req, res, next) => {
  const { itemId, mediaType } = req.query;
  if (!itemId || !mediaType) {
    return res
      .status(400)
      .json({ message: "itemId and mediaType are required" });
  }
  fetchTmdbKeywords(itemId, mediaType)
    .then((keywords) => res.status(ERROR_CODES.OK).json({ keywords }))
    .catch(next);
};

module.exports = {
  getItems,
  getUserItems,
  createItem,
  importFromTmdb,
  updateItem,
  updateItemTags,
  deleteItem,
  getTmdbKeywords,
};
