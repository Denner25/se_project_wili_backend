const router = require("express").Router();
const {
  getCurrentUser,
  updateProfile,
  getUserById,
} = require("../controllers/users");
const { validateProfileUpdate } = require("../middlewares/validation");

router.get("/me", getCurrentUser);
router.patch("/me", validateProfileUpdate, updateProfile);
router.get("/:id", getUserById);

module.exports = router;
