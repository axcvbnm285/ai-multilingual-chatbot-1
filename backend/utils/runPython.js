import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runPython = (scriptName, args = []) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, `../python/${scriptName}`);
    const process = spawn("python", [scriptPath, ...args]);

    let result = "";
    process.stdout.on("data", data => (result += data.toString()));
    process.stderr.on("data", err => console.error("🐍 Python Error:", err.toString()));

    process.on("close", code => {
      if (code === 0) resolve(result.trim());
      else reject(`Python exited with code ${code}`);
    });
  });
};
