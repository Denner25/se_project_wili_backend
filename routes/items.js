const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  updateItem,
  updateItemTags,
} = require("../controllers/items");
const {
  validateItemBody,
  validateId,
  validateItemTags,
} = require("../middlewares/validation");

router.get("/", getItems);
router.post("/", validateItemBody, createItem);
router.patch("/:itemId", validateItemBody, validateId, updateItem);
router.patch("/:itemId/tags", validateItemTags, updateItemTags);
router.delete("/:itemId", validateId, deleteItem);

module.exports = router;
