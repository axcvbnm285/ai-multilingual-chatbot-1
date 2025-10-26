const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");

router.post("/", (req, res) => {
  const userText = req.body.text;
  const pythonProcess = spawn("python", ["../python_assistant/assistant_text.py", userText]);

  let result = "";
  pythonProcess.stdout.on("data", (data) => (result += data.toString()));
  pythonProcess.stderr.on("data", (data) => console.error(data.toString()));

  pythonProcess.on("close", () => {
    res.json({ reply: result, lang: "en-US" }); // language detection can be improved
  });
});

module.exports = router;
