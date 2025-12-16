const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getCurrentUser,
  updateProfile,
  getUserById,
  getUsers,
} = require("../controllers/users");
const { validateProfileUpdate } = require("../middlewares/validation");

router.get("/", getUsers);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateProfileUpdate, updateProfile);
router.get("/:id", getUserById);

module.exports = router;
