import { runPython } from "../utils/runPython.js";

export const handleAIQuery = async (req, res) => {
  try {
    const { text, language } = req.body;

    // Default fallback values
    const inputText = text || "Hello, who are you?";
    const lang = language || "en";

    console.log(`🧠 Sending to Python: text="${inputText}", language="${lang}"`);

    const output = await runPython("voice_assistant.py", [inputText, lang]);
    console.log("🐍 Python returned:", output);

    res.json({ response: output });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
