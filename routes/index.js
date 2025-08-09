const router = require("express").Router();
const auth = require("../middlewares/auth");
const userRouter = require("./users");
const itemsRouter = require("./items");
const { ERROR_MESSAGES } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const { getItems, getAllItems } = require("../controllers/items");
const {
  validateUserBody,
  validateLogin,
} = require("../middlewares/validation");
const NotFoundError = require("../errors/not-found-err");

// Public routes
router.post("/signin", validateLogin, login);
router.post("/signup", validateUserBody, createUser);
router.get("/items", getAllItems); // Public: all items for main page

// Authenticated routes
router.use(auth);
router.get("/user-items", getItems); // Private: only user's items
router.use("/items", itemsRouter); // POST, PATCH, DELETE, etc.
router.use("/users", userRouter);

router.use((req, res, next) => {
  next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND));
  // ...existing code...
});

module.exports = router;
