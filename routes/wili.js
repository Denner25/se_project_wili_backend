const router = require("express").Router();
const { getWiliResponse } = require("../controllers/wili");

router.post("/", getWiliResponse);

module.exports = router;
