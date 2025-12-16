const router = require("express").Router();
const auth = require("../middlewares/auth");
const userRouter = require("./users");
const itemsRouter = require("./items");
const { ERROR_MESSAGES } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const {
  getItems,
  getUserItems,
  getLatestItems,
} = require("../controllers/items");
const { validateUser, validateLogin } = require("../middlewares/validation");
const NotFoundError = require("../errors/not-found-err");

// Public routes
router.post("/signin", validateLogin, login);
router.post("/signup", validateUser, createUser);
router.get("/items", getItems); // Public: all items for main page
router.get("/items/latest", getLatestItems);
router.use("/users", userRouter);

// Authenticated routes
router.use(auth);
router.get("/user-items", getUserItems); // Private: only user's items
router.use("/items", itemsRouter); // POST, PATCH, DELETE, etc.

router.use((req, res, next) => {
  next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND));
});

module.exports = router;
