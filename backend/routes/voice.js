const express = require("express");
const router = express.Router();
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const upload = multer({ dest: path.join(__dirname, "../temp_audio/") });

router.post("/", upload.single("audio"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No audio file" });

  const inputPath = req.file.path;
  const outputAudio = inputPath.replace(".webm", "_reply.wav");

  const pythonProcess = spawn("python", [
    "../python_assistant/assistant_voice.py",
    inputPath,
    outputAudio,
  ]);

  let responseText = "";
  pythonProcess.stdout.on("data", (data) => (responseText += data.toString()));
  pythonProcess.stderr.on("data", (data) => console.error(data.toString()));

  pythonProcess.on("close", () => {
    // Delete uploaded audio after processing
    fs.unlinkSync(inputPath);
    res.json({ reply: responseText, audioFile: path.basename(outputAudio), text: responseText, lang: "en-US" });
  });
});

module.exports = router;
