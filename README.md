# AURA AI - Voice & Text Chat Assistant

AURA AI is a full-stack web application that allows users to interact with an AI assistant via **text** or **voice**. The assistant can respond in text and generate **speech output**. It supports multiple input methods and provides a seamless chat experience.

---


---

## 🛠️ Tech Stack

### **Frontend**
- React.js
- HTML5, CSS3, JavaScript
- Web Speech API (for voice input)
- Axios (for API requests)

### **Backend**
- Node.js + Express.js
- MongoDB (for user authentication)
- Child Process (to run Python TTS & AI scripts)
- Multer (for audio file upload)
- CORS & Body-parser

### **AI & Voice**
- Python 3
- Perplexity API (AI responses)
- gTTS (Text-to-Speech)
- Langdetect (auto-detect user language)
- Google Translator (multi-language support)

---

project-root/
│
├─ backend/ # Node.js backend
│ ├─ routes/ # API routes
│ ├─ python/ # Python scripts for AI & TTS
│ ├─ models/ # MongoDB models
│ ├─ .env # Environment variables
│ └─ server.js # Main backend server
│
├─ frontend/ # React frontend
│ ├─ src/
│ ├─ public/
│ └─ package.json
│
├─ .gitignore
└─ README.md

## 📂 Folder Structure

---

## ⚡ Features

- **Text Chat**: Type a query and get a text response from AURA AI.
- **Voice Input**: Speak your query and get a response.
- **Audio Output**: Responses are generated as speech using TTS.
- **Multi-language Support**: Automatically detects language and responds in the same language.
- **User Authentication**: Login and signup using MongoDB.

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

