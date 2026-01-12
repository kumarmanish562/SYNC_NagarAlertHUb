import google.generativeai as genai
import os
from dotenv import load_dotenv
from pathlib import Path
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)
genai.configure(api_key=os.getenv('GOOGLE_GEMINI_API_KEY'))

print("Searching for 'flash' models...")
for m in genai.list_models():
    if 'flash' in m.name and 'generateContent' in m.supported_generation_methods:
        print(m.name)
