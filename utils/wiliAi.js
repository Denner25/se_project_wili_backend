// backend/utils/wiliAi.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// 1. SYSTEM INSTRUCTIONS: Defined once at the top level
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: `
    STRICT RULES:
    - Answer with a short paragraph 65 to 80 words long.
    - If isOwner is true, refer to the user as 'you'.
    - If isOwner is false, refer to the user by the 'targetName' provided.
  `,
});

async function generateWiliResponse({
  userLikes,
  candidate,
  isOwner,
  targetName,
}) {
  if (!Array.isArray(userLikes) || !candidate) {
    throw new Error("userLikes and candidate are required");
  }

  const likedTitles = userLikes
    .map((item) => `${item.title} (${item.mediaType})`)
    .join(", ");

  // 2. DATA PACKET: We only send the raw data now
  const prompt = `
    DATA:
    - isOwner: ${isOwner}
    - targetName: ${targetName}
    - Likes: ${likedTitles}
    - Candidate: ${candidate.title} (${candidate.mediaType})
    QUESTION: Based on their liked titles, would they like this candidate?
  `;

  try {
    // 4. THE LIVE API CALL
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/\*/g, "") || "No response";

    return text.split("\n").filter(Boolean);
  } catch (err) {
    console.error("WiliAi Exception:", err);
    // Specifically handle the 429 Error in the logs
    if (err.message.includes("429")) {
      console.warn("⚠️ QUOTA EXCEEDED ");
    }
    throw new Error("Failed to get WiliAi response");
  }
}

module.exports = { generateWiliResponse };
