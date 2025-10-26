import os
import requests
from pathlib import Path
from audio_player import play_audio
from gtts import gTTS  # for text-to-speech

class PerplexityClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.api_url = "https://api.perplexity.ai/chat/completions"

    def chat_with_perplexity(self, prompt: str) -> str:
        """Send a query to Perplexity and get an AI-generated response."""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }
            data = {
                "model": "sonar-medium-chat",  # or sonar-small-chat / sonar-large-chat
                "messages": [{"role": "user", "content": prompt}],
            }

            response = requests.post(self.api_url, headers=headers, json=data)
            response.raise_for_status()
            json_data = response.json()

            return json_data["choices"][0]["message"]["content"].strip()

        except Exception as e:
            print(f"⚠️ Perplexity Error: {e}")
            return "Sorry, I couldn’t process your request right now."

    def text_to_speech(self, text: str) -> str:
        """Convert Perplexity's text output into speech using gTTS."""
        try:
            output_dir = Path(__file__).parent / "audio_outputs"
            output_dir.mkdir(exist_ok=True)
            filename = output_dir / "output_speech.mp3"

            tts = gTTS(text=text, lang="en")
            tts.save(str(filename))
            return str(filename)

        except Exception as e:
            print(f"⚠️ TTS Error: {e}")
            return ""

    def chat_and_speak(self, prompt: str) -> str:
        """Ask Perplexity and play the voice response."""
        reply_text = self.chat_with_perplexity(prompt)
        if reply_text:
            audio_file = self.text_to_speech(reply_text)
            if audio_file:
                print("🔊 Playing voice response...")
                play_audio(audio_file)
        return reply_text
