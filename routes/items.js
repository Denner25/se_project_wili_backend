const router = require("express").Router();
const {
  createItem,
  importFromTmdb,
  updateItem,
  updateItemTags,
  deleteItem,
  getTmdbKeywords,
} = require("../controllers/items");
const {
  validateItem,
  validateTags,
  validateId,
} = require("../middlewares/validation");

// No auth here, since handled upstream

router.post("/", validateItem, createItem);
router.post("/import-tmdb", importFromTmdb);
router.patch("/:itemId", validateId, updateItem);
router.patch("/:itemId/tags", validateTags, updateItemTags);

// Endpoint to fetch TMDB keywords for a given tmdbId and mediaType
router.get("/tmdb-keywords", getTmdbKeywords);
router.delete("/:itemId", validateId, deleteItem);

module.exports = router;
