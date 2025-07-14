require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate-affirmation", async (req, res) => {
  const profile = req.body;

  const prompt = `Ти — добрий коуч. Згенеруй одну афірмацію українською мовою до 25 слів на основі профілю:
  Почуття: ${profile.current_feeling}
  Сфери: ${profile.life_areas.join(", ")}
  Важливе: ${profile.important_aspects.join(", ")}
  Мета: ${profile.main_goal}
  Стиль: ${profile.affirmation_style}

  Афірмація:`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
    });

    const result = completion.data.choices[0].message.content.trim();
    res.json({ affirmation: result });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "AI error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
