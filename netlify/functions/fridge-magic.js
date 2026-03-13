// netlify/functions/fridge-magic.js
// Receives a base64 photo of ingredients + goal, uses OpenAI Vision (GPT-4o)
// to identify ingredients and generate a structured recipe JSON.

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "OpenAI API key not configured." }) };
  }

  let body;
  try { body = JSON.parse(event.body); } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body." }) };
  }

  const { image, mimeType, goal } = body;
  if (!image) {
    return { statusCode: 400, body: JSON.stringify({ error: "No image provided." }) };
  }

  const goalMap = {
    "balanced":    "a balanced, nutritious meal",
    "high-protein":"a high-protein meal (aim for 35g+ protein)",
    "low-carb":    "a low-carb meal (under 30g net carbs)",
    "plant-based": "a plant-based / vegan-friendly meal",
    "quick":       "a quick meal ready in under 20 minutes",
  };
  const goalDesc = goalMap[goal] || "a balanced, nutritious meal";
  const imgMime  = mimeType || "image/jpeg";

  const textPrompt = `You are a professional nutritionist chef. Look at this photo of ingredients in someone's fridge or kitchen.

1. Identify ALL visible food ingredients in the photo.
2. Using those ingredients (plus minimal pantry staples like oil, salt, spices), create ${goalDesc}.

Return ONLY valid JSON in exactly this format (no markdown, no explanation):
{
  "name": "Recipe Name",
  "emoji": "🍽️",
  "time": "25 min",
  "serves": 1,
  "calories": 520,
  "protein": 38,
  "carbs": 45,
  "fat": 14,
  "ingredients": [
    "6 oz chicken breast",
    "¾ cup brown rice",
    "1 cup broccoli florets",
    "1 tbsp olive oil"
  ],
  "steps": [
    "Season chicken and cook on medium heat 6 min per side.",
    "Cook rice per package directions.",
    "Steam broccoli 4 min.",
    "Plate and drizzle olive oil."
  ]
}

Rules:
- Use only ingredients visible in the photo (add minimal pantry staples like oil, salt, spices).
- Make it genuinely healthy and delicious.
- Calories and macros must be realistic estimates for 1 serving.
- Emoji should match the dish visually.
- Steps should be clear and concise (3-6 steps).`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${imgMime};base64,${image}`,
                  detail: "high",
                },
              },
              {
                type: "text",
                text: textPrompt,
              },
            ],
          },
        ],
        max_tokens: 700,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return { statusCode: 500, body: JSON.stringify({ error: "OpenAI error: " + err }) };
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || "";

    // Strip possible markdown fences
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let recipe;
    try { recipe = JSON.parse(cleaned); }
    catch {
      return { statusCode: 500, body: JSON.stringify({ error: "Could not parse AI response.", raw }) };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipe),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || "Unknown error" }) };
  }
};
