// backend/utils/wiliAi.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");

// Initialize the client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Generate AI response about whether the user would like a candidate item
 * @param {Object} params
 * @param {Array} params.userLikes - Array of liked items
 * @param {Object} params.candidate - Candidate item to evaluate
 * @returns {Promise<Array<string>>} - Array of text lines from AI
 */
async function generateWiliResponse({ userLikes, candidate }) {
  if (!Array.isArray(userLikes) || !candidate) {
    throw new Error("userLikes array and candidate item are required");
  }

  // Build prompt from userLikes + candidate
  const likedTitles = userLikes
    .map((item) => `${item.title} (${item.mediaType})`)
    .join(", ");

  const prompt = `Based on these items the user likes: ${likedTitles}.
Would they like this item: ${candidate.title} (${candidate.mediaType})? Answer briefly.`;

  try {
    const result = await model.generateContent({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });

    // --- Robust parsing for both old and new SDK response formats ---
    const contentParts =
      result.response?.content?.[0]?.parts ||
      result.response?.candidates?.[0]?.content?.parts;

    const text = contentParts?.map((p) => p.text).join("\n") || "No response";

    return text.split("\n").filter(Boolean);
  } catch (err) {
    console.error("WiliAi Exception:", err);
    throw new Error("Failed to get WiliAi response");
  }
}

module.exports = { generateWiliResponse };
