import firebase_admin
from firebase_admin import credentials
from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
import os
from dotenv import load_dotenv

# --- INIT FIREBASE ---
load_dotenv()

cred_path = os.getenv("FIREBASE_CREDENTIALS", "nagar-alert-hub-ranchi-firebase-adminsdk-fbsvc-927c318a04.json")

if os.path.exists(cred_path):
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred, {
        'databaseURL': os.getenv("FIREBASE_DB_URL") 
    })
    print("Firebase Admin Initialized successfully.")
else:
    print(f"Warning: Firebase credentials file not found at {cred_path}")

# --- INIT FLASK ---
app = Flask(__name__)
CORS(app) # Enable Cross-Origin Resource Sharing

# --- REGISTER ROUTES ---
app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/')
def home():
    return "Nagar Alert Hub Backend is Running!"

if __name__ == '__main__':
    app.run(debug=True, port=5000)
