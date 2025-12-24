// controllers/wili.js
const { generateWiliResponse } = require("../utils/wiliAi");

async function getWiliResponse(req, res) {
  try {
    const {
      userLikes,
      candidate,
      isOwner,
      targetName: targetFirstName,
    } = req.body;
    const response = await generateWiliResponse({
      userLikes,
      candidate,
      isOwner,
      targetName: targetFirstName,
    }); // ✅ pass as single object
    res.json(response);
  } catch (err) {
    console.error("WiliAi Exception:", err);
    res.status(500).json({ message: "Failed to get Wili response" });
  }
}

module.exports = { getWiliResponse };
