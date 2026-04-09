import Groq from "groq-sdk";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

export const getBookRecommendations = catchAsyncErrors(async (req, res, next) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const { genres, userInput, libraryBooks } = req.body;

  if (!userInput && (!genres || genres.length === 0)) {
    return next(new ErrorHandler("Please provide preferences or genres", 400));
  }

  const prompt = `You are a library book recommendation assistant for ShelfSync.

${libraryBooks ? `Books available in the library:\n${libraryBooks}` : ""}

User preferences:
${genres?.length > 0 ? `- Preferred genres: ${genres.join(", ")}` : ""}
${userInput ? `- Looking for: ${userInput}` : ""}

Recommend exactly 4 books. Respond ONLY with a valid JSON array, no markdown, no explanation:
[
  {
    "title": "Book Title",
    "author": "Author Name",
    "reason": "One sentence why this matches their preferences",
    "match": 95,
    "category": "Genre",
    "available": true
  }
]

Mark available as true only if the book is in the library list. Match is 70-99. Respond with ONLY the JSON array.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 1000,
  });

  const text = completion.choices[0]?.message?.content || "";
  console.log("🤖 Groq response:", text);

  const clean = text.replace(/```json|```/g, "").trim();
  const recommendations = JSON.parse(clean);

  res.status(200).json({ success: true, recommendations });
});