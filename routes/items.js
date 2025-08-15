const router = require("express").Router();
const {
  createItem,
  importFromTmdb,
  updateItem,
  updateItemMoods, // new controller for likes-style moods
  deleteItem,
  getTmdbKeywords,
} = require("../controllers/items");
const {
  validateItem,
  validateMoods,
  validateId,
} = require("../middlewares/validation");

// POST new item
router.post("/", validateItem, createItem);

// POST import from TMDB
router.post("/import-tmdb", importFromTmdb);

// PATCH general item fields (title, poster, etc.)
router.patch("/:_id", validateId, updateItem);

// PATCH only moods for likes-style
router.patch("/:_id/moods", validateId, validateMoods, updateItemMoods);

// GET TMDB keywords
router.get("/tmdb-keywords", getTmdbKeywords);

// DELETE item
router.delete("/:_id", validateId, deleteItem);

module.exports = router;
