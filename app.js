require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const limiter = require("./utils/rateLimiter");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { errorHandler } = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const Item = require("./models/items");

const app = express();
const { PORT = 3001, MONGO_URI = "mongodb://127.0.0.1:27017/wili_db" } =
  process.env;

app.get("/health", async (_req, res) => {
  try {
    // 1. Ensure DB is actually reachable
    await Item.db.admin().ping();

    // 2. Check for real items
    const items = await Item.find({}).limit(1).lean();
    if (!items || items.length === 0 || !items[0]._id) {
      throw new Error("no items found");
    }

    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ status: "unhealthy", message: err.message });
  }
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(limiter);

app.use(requestLogger);

if (process.env.NODE_ENV !== "production") {
  app.get("/crash-test", () => {
    setTimeout(() => {
      throw new Error("Server will crash now");
    }, 0);
  });
}

app.use("/", mainRouter);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
