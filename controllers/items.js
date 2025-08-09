const Item = require("../models/items");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");
const {
  handleValidationAndCastError,
  handleCastAndNotFoundError,
} = require("../utils/constants");

// Public: get all items
const getAllItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.status(ERROR_CODES.OK).send({ data: items }))
    .catch(next);
};

const getItems = (req, res, next) => {
  Item.find({ owner: req.user._id })
    .then((items) => res.status(ERROR_CODES.OK).send({ data: items }))
    .catch(next);
};

const createItem = (req, res, next) => {
  const { title, mediaType, poster, length, tags, tmdbId } = req.body;
  Item.create({
    title,
    mediaType,
    poster,
    length,
    tags: tags || [],
    tmdbId,
    owner: req.user._id,
  })
    .then((item) => res.status(ERROR_CODES.CREATED).send({ data: item }))
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
  Item.findById(req.params.itemId)
    .orFail(() => new NotFoundError(ERROR_MESSAGES.NOT_FOUND))
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
      }
      item.tags = Array.isArray(tags) ? tags : item.tags;
      return item.save();
    })
    .then((updatedItem) =>
      res.status(ERROR_CODES.OK).send({ data: updatedItem })
    )
    .catch((err) => handleValidationAndCastError(err, next));
};

module.exports = {
  getAllItems,
  getItems,
  createItem,
  deleteItem,
  updateItem,
  updateItemTags,
};
