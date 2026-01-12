import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db
import google.generativeai as genai
from google.cloud import bigquery
from dotenv import load_dotenv

# Load environment variables
from pathlib import Path

# Load environment variables explicitly from .env in the same directory
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
CORS(app) # Allow frontend to communicate

# ---------------------------------------------------------------------------
# 1. Firebase Initialization
# ---------------------------------------------------------------------------
# Check for service account file, otherwise use default creds or error
cred_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH') or 'serviceAccountKey.json'

if not firebase_admin._apps:
    try:
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred, {
                'databaseURL': os.getenv('FIREBASE_DATABASE_URL') or 'https://nagar-alert-hub-ranchi-default-rtdb.firebaseio.com',
                'storageBucket': os.getenv('FIREBASE_STORAGE_BUCKET') or 'nagaralerthub-1df7f.firebasestorage.app'
            })
            print("Firebase initialized with service account.")
        else:
            # Fallback for dev/demo if no key yet (Warn user)
            print("WARNING: 'serviceAccountKey.json' not found. functions dependent on Firebase Admin will fail.")
            # Start without creds just to keep app alive? No, usually safer to fail or mock.
            # We'll try to init with default for GCP environment
            # firebase_admin.initialize_app() 
            pass 
    except Exception as e:
        print(f"Error initializing Firebase: {e}")

# ---------------------------------------------------------------------------
# 2. Google Gemini API (GenAI) Initialization
# ---------------------------------------------------------------------------
GEMINI_API_KEY = os.getenv('GOOGLE_GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    # gemini-2.0-flash is valid
    model = genai.GenerativeModel('gemini-2.0-flash') 
    print("Gemini API initialized with gemini-2.0-flash.")
else:
    print("WARNING: GOOGLE_GEMINI_API_KEY not set.")

# ---------------------------------------------------------------------------
# 3. BigQuery Initialization
# ---------------------------------------------------------------------------
# BigQuery client automatically looks for GOOGLE_APPLICATION_CREDENTIALS
try:
    bq_client = bigquery.Client()
    print("BigQuery Client initialized.")
except Exception as e:
    print(f"BigQuery Client init skipped (might need creds): {e}")


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "Backend is running", "service": "NagarAlertHub"}), 200

@app.route('/api/verify-image', methods=['POST'])
def verify_image():
    """
    1. Google Gemini API: Check photo to confirm problem is real.
    expects: multipart/form-data with 'image' file and optional 'description'
    """
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']
    # description = request.form.get('description', '')

    # Lazy load key/config to handle environment loading issues
    key = os.getenv('GOOGLE_GEMINI_API_KEY')
    if not key:
        # Try reloading env
        load_dotenv(dotenv_path=Path(__file__).parent / '.env', override=True)
        key = os.getenv('GOOGLE_GEMINI_API_KEY')

    if not key:
        print("ERROR: GOOGLE_GEMINI_API_KEY is missing from environment.")
        return jsonify({"error": "Gemini API key not configured"}), 503
    
    # Configure GenAI if not already done (or re-configure)
    try:
        genai.configure(api_key=key)
        if 'model' not in globals():
            global model
            # Updated to gemini-2.0-flash as 1.5 was not found
            model = genai.GenerativeModel('gemini-2.0-flash')
    except Exception as e:
         print(f"GenAI Config/Model Init Error: {e}")
         return jsonify({"error": f"AI Initialization Failed: {str(e)}"}), 500


    try:
        # Read image bytes
        image_data = file.read()
        
        # Prepare prompt for Gemini
        prompt = "Analyze this image. Is this a civic issue (e.g., pothole, garbage, broken street light, water logging)? Answer 'YES' or 'NO' followed by a short explanation."
        
        # Call Gemini with the image data
        response = model.generate_content([
            prompt, 
            {
                "mime_type": file.mimetype, 
                "data": image_data
            }
        ])

        
        try:
            ai_response = response.text
        except ValueError:
            # If AI blocks the response (Safety filters), usually response.text raises ValueError
            print("Gemini blocked response due to safety filters.")
            return jsonify({
                 "verified": False,
                 "explanation": "Image content flagged by safety filters. Please try another image.",
                 "ai_confidence": 0.0
            })
        is_real_problem = "YES" in ai_response.upper()
        explanation = ai_response.replace("YES", "").replace("NO", "").strip()[:200] # Clean up
        
        return jsonify({
            "verified": is_real_problem,
            "explanation": explanation,
            "ai_confidence": 0.95
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Detailed Error: {str(e)}"}), 500

@app.route('/api/submit-report', methods=['POST'])
def submit_report():
    """
    2. Firebase Cloud Functions (Simulated here): Automatically sorts reports and sends alerts.
    3. Firebase Realtime Database: Updates admin dashboard instantly.
    """
    data = request.json
    # Expected data: { userId, location: {lat, lng}, type, description, imageUrl, priority }
    
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        # 1. Sort/Classify (Logic) - e.g. High priority if 'SafeToAutoRun' keyword or 'Accident'
        priority = data.get('priority', 'Normal')
        category = data.get('type', 'General')
        
        if 'fire' in category.lower() or 'accident' in category.lower():
            priority = 'Critical'
            # Trigger alert (Simulated)
            print(f"ALERT: CRITICAL INCIDENT REPORTED at {data.get('location')}")

        # 2. Save to Realtime Database
        ref = db.reference('reports')
        new_report_ref = ref.push()
        report_id = new_report_ref.key
        
        report_entry = {
            "id": report_id,
            "status": "Pending", # Pending, In Progress, Resolved
            "timestamp": {".sv": "timestamp"}, # Server value
            "priority": priority,
            **data
        }
        
        new_report_ref.set(report_entry)

        # ---------------------------------------------------------
        # POINTS SYSTEM LOGIC
        # ---------------------------------------------------------
        user_id = data.get('userId')
        if user_id:
            try:
                # Determine points change
                points_change = 0
                is_verified = data.get('aiVerified', False)
                
                if is_verified:
                    points_change = 10
                else:
                    points_change = -5

                # Update user points transactionally
                user_points_ref = db.reference(f'users/citizens/{user_id}/points')
                
                # Transaction function to safely increment/decrement
                def update_points(current_points):
                    if current_points is None:
                        return points_change # Start at change
                    return current_points + points_change
                
                user_points_ref.transaction(update_points)
                print(f"Points updated for {user_id}: {points_change}")
                
            except Exception as pe:
                print(f"Failed to update points: {pe}")

        # ---------------------------------------------------------
        # BROADCAST ALERT LOGIC (New Feature)
        # ---------------------------------------------------------
        if priority in ['Critical', 'High']:
            # 1. Fetch all broadcast contacts (In prod, filter by location/geo-query)
            contacts_ref = db.reference('broadcast_contacts')
            contacts_snapshot = contacts_ref.get()
            
            if contacts_snapshot:
                alert_count = 0
                for uid, contact in contacts_snapshot.items():
                    # mock geo-check: if contact['address'] contains part of report location desc
                    # For now, we broadcast to ALL for demo purposes if it's Critical
                    mobile = contact.get('mobile')
                    
                    if mobile:
                        # SIMULATE SMS SENDING
                        print(f"!!! SMS BROADCAST SENT TO {mobile} !!!")
                        print(f"Message: ALERT! {category} reported at {data.get('location')}. Stay safe.")
                        alert_count += 1
                
                print(f"Total Broadcasts Sent: {alert_count}")

        return jsonify({"success": True, "reportId": report_id, "message": "Report submitted and alerts processed."}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

from firebase_admin import storage

@app.route('/api/upload-image', methods=['POST'])
def upload_image_proxy():
    """
    Saves image locally to 'static/uploads' to bypass Firebase Storage issues.
    """
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']
    if not file:
         return jsonify({"error": "Empty file"}), 400

    try:
        # Save locally
        upload_dir = os.path.join(app.root_path, 'static', 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        
        filename = f"{os.urandom(8).hex()}_{file.filename}"
        file_path = os.path.join(upload_dir, filename)
        file.save(file_path)
        
        # Return local URL
        # Assuming server running on port 5000
        # In prod, this would need domain config, but for localhost dev it's fine.
        url = f"http://localhost:5000/static/uploads/{filename}"
        
        return jsonify({
            "success": True, 
            "url": url
        }), 200

    except Exception as e:
        print(f"Upload Error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/archive-reports', methods=['POST'])
def archive_old_reports():
    """
    5. Google BigQuery: Stores old reports.
    Move reports from Realtime DB to BigQuery (ETL).
    """
    try:
        # Fetch old reports from Firebase
        ref = db.reference('reports')
        # Logic to query by timestamp (older than 30 days, etc) would go here
        # snapshot = ref.order_by_child('timestamp').end_at(cutoff_time).get()
        
        # Insert into BigQuery
        # table_id = "nagar-alert-hub-ranchi.civic_data.reports"
        # rows_to_insert = [ ... ]
        # errors = bq_client.insert_rows_json(table_id, rows_to_insert)
        
        return jsonify({"status": "Not implemented yet (Requires BQ schema setup)"}), 501
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Local dev server
    app.run(debug=True, port=5000)
