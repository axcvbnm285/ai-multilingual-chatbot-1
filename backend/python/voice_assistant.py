import os
import random
import re
import sys
import sounddevice as sd
from scipy.io.wavfile import write
import speech_recognition as sr
from deep_translator import GoogleTranslator
from perplexity import Perplexity
from audio_player import play_audio
from languages import languages_dict
from gtts import gTTS
from dotenv import load_dotenv
load_dotenv()


def clean_text_for_tts(text):
    cleaned = re.sub(r"[^a-zA-Z0-9\s,.?!]", "", text)
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned.strip()


def record_audio(filename="input.wav", duration=5, fs=44100):
    """Record audio from microphone using sounddevice."""
    print(f"Recording for {duration} seconds...")
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=1)
    sd.wait()
    write(filename, fs, recording)
    print("Recording complete.")
    return filename


def recognize_audio(file_path="input.wav", language="en-US"):
    """Convert recorded audio to text using SpeechRecognition."""
    recognizer = sr.Recognizer()
    with sr.AudioFile(file_path) as source:
        audio_data = recognizer.record(source)
        try:
            text = recognizer.recognize_google(audio_data, language=language)
            return text
        except sr.UnknownValueError:
            return ""
        except Exception as e:
            print(f"Speech recognition error: {e}")
            return ""


class VoiceAssistant:
    def __init__(self):
        self.perplexity_client = Perplexity(api_key=os.environ.get('PERPLEXITY_API_KEY'))

    def conduct_query(self, query_text, language_code):
        """Send query to Perplexity and return translated response."""
        try:
            # Translate query to English
            user_input_en = GoogleTranslator(source='auto', target='en').translate(query_text)
        except Exception:
            user_input_en = query_text

        # Get response from Perplexity
        try:
            response_obj = self.perplexity_client.chat.completions.create(
                model="sonar-pro",
                messages=[{"role": "user", "content": user_input_en}]
            )
            assistant_response = getattr(response_obj.choices[0].message, "content", None) or \
                                 response_obj.get("result", "Sorry, no response.")
        except Exception as e:
            print(f"Perplexity error: {e}")
            assistant_response = "Sorry, could not process request."

        # Translate back to user language
        try:
            translated_response = GoogleTranslator(source='en', target=language_code[1]).translate(assistant_response)
        except Exception:
            translated_response = assistant_response

        print(f"Assistant: {translated_response}")

        # Generate TTS
        try:
            tts_text = clean_text_for_tts(translated_response)
            tts = gTTS(tts_text, lang=language_code[0])
            audio_filepath = "response.mp3"
            tts.save(audio_filepath)
            play_audio(audio_filepath)
        except Exception as e:
            print(f"TTS failed: {e}")

        return translated_response


# Example usage
if __name__ == "__main__":
    language_code = ["en-US", "en"]  # default English
    assistant = VoiceAssistant()

    # Record user query
    audio_file = record_audio(duration=5)
    text = recognize_audio(audio_file, language=language_code[0])
    print(f"You said: {text}")

    if text:
        assistant.conduct_query(text, language_code)
    else:
        print("No input detected.")
