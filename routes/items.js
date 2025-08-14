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
router.patch("/:itemId", validateId, updateItem);

// PATCH only moods for likes-style
router.patch("/:itemId/moods", validateId, validateMoods, updateItemMoods);

// GET TMDB keywords
router.get("/tmdb-keywords", getTmdbKeywords);

// DELETE item
router.delete("/:itemId", validateId, deleteItem);

module.exports = router;
