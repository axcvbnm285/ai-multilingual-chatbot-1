import React, { useEffect, useRef, useState } from "react";

export default function ChatUI() {
  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("chat_history")) || [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const scrollRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(messages));
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight + 200;
  }, [messages]);

  // Send text message
  const sendText = async () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      text: input,
      time: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userMsg.text }),
      });
      const data = await res.json();

      const botMsg = {
        id: Date.now() + 1,
        role: "bot",
        text: data.reply || "No response",
        lang: data.lang || "en-US",
        time: new Date().toISOString(),
      };
      setMessages((m) => [...m, botMsg]);

      // Auto speak
      speak(botMsg.text, botMsg.lang);
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        { id: Date.now(), role: "bot", text: "Error contacting server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle voice recording
  const toggleRecording = async () => {
    if (!recording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = handleVoiceSend;
      mediaRecorderRef.current.start();
      setRecording(true);
    } else {
      mediaRecorderRef.current.stop();
      const tracks = mediaRecorderRef.current.stream?.getTracks() || [];
      tracks.forEach((t) => t.stop());
      setRecording(false);
    }
  };

  // Handle sending recorded voice
  const handleVoiceSend = async () => {
    const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const form = new FormData();
    form.append("audio", blob, "input.webm");

    const tempMsg = {
      id: Date.now(),
      role: "user",
      text: "[Voice message — transcribing...]",
      time: new Date().toISOString(),
    };
    setMessages((m) => [...m, tempMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/voice", { method: "POST", body: form });
      const data = await res.json();

      setMessages((prev) => {
        const copy = [...prev];
        const idx = copy.findIndex((x) => x.id === tempMsg.id);
        if (idx >= 0) copy[idx].text = data.text || "[Voice input]";
        copy.push({
          id: Date.now() + 1,
          role: "bot",
          text: data.reply || "No response",
          lang: data.lang || "en-US",
          time: new Date().toISOString(),
        });

        speak(data.reply, data.lang);
        return copy;
      });
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        { id: Date.now(), role: "bot", text: "Voice processing failed." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Browser TTS (fallback if Python TTS not used)
  const speak = (text, lang = "en-US") => {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    window.speechSynthesis.speak(utter);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chat_history");
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.keyCode === 13) && !e.shiftKey) {
      e.preventDefault();
      sendText();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Luna AI Chatbot</h1>
        <button
          onClick={clearChat}
          className="text-gray-600 hover:text-red-500 font-medium"
        >
          Clear Chat
        </button>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[70%] ${
                m.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none shadow"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-500 text-sm">Thinking...</div>}
      </div>

      <div className="flex items-center p-4 bg-white border-t gap-2">
        <button
          onClick={toggleRecording}
          className={`p-3 rounded-full ${
            recording
              ? "bg-red-500 text-white"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {recording ? "⏹️" : "🎙️"}
        </button>
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 border rounded-xl px-4 py-3 resize-none focus:ring-2 focus:ring-indigo-200 outline-none"
        />
        <button
          onClick={sendText}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
