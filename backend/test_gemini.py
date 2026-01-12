import os
import google.generativeai as genai
from dotenv import load_dotenv
from pathlib import Path

# Load env
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

api_key = os.getenv('GOOGLE_GEMINI_API_KEY')
genai.configure(api_key=api_key)

print("--- Available Models ---")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f"Name: {m.name}")

print("\n--- Testing Model ---")
try:
    # Try the one likely to work
    model_name = 'gemini-1.5-flash' 
    print(f"Trying {model_name}...")
    model = genai.GenerativeModel(model_name)
    response = model.generate_content("Hello")
    print("Success!")
except Exception as e:
    print(f"Failed with {model_name}: {e}")
    
try:
    model_name = 'gemini-1.5-flash-latest'
    print(f"Trying {model_name}...")
    model = genai.GenerativeModel(model_name)
    response = model.generate_content("Hello")
    print("Success!")
except Exception as e:
    print(f"Failed with {model_name}: {e}")

try:
    model_name = 'models/gemini-1.5-flash' # Sometimes needs prefix
    print(f"Trying {model_name}...")
    model = genai.GenerativeModel(model_name)
    response = model.generate_content("Hello")
    print("Success!")
except Exception as e:
    print(f"Failed with {model_name}: {e}")
