const express = require("express");
const { spawn } = require("child_process");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// Endpoint to send query text
app.post("/api/query", (req, res) => {
  const { text, lang } = req.body;

  // Call Python script
  const pythonProcess = spawn("python3", [
    path.join(__dirname, "python", "voice_assistant.py"),
    text,
    lang || "en"
  ]);

  let dataToSend = "";

  pythonProcess.stdout.on("data", (data) => {
    dataToSend += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });

  pythonProcess.on("close", (code) => {
    res.json({ reply: dataToSend.trim() });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
