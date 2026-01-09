import random
import string
import smtplib
import datetime
from email.mime.text import MIMEText
from flask import Blueprint, request, jsonify
from firebase_admin import auth, db

auth_bp = Blueprint('auth', __name__)

import os
from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION ---
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
ADMIN_SECRET_CODE = os.getenv("ADMIN_SECRET_CODE", "NAGAR_ADMIN_2025") 

def send_smtp_email(to_email, subject, body):
    try:
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = SMTP_EMAIL
        msg['To'] = to_email
        # Using Gmail SMTP for free testing 
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"SMTP Error: {e}")
        return False

# 1. MOBILE SYNC: Detects if user exists in Realtime Database after Phone Auth
@auth_bp.route('/mobile-sync', methods=['POST'])
def mobile_sync():
    data = request.json
    id_token = data.get('idToken')
    role = data.get('role', 'citizen') 

    try:
        # Verify the Firebase Phone Auth Token 
        decoded = auth.verify_id_token(id_token)
        uid = decoded['uid']

        # Check Realtime Database for existing record 
        ref = db.reference(f'users/{role}s/{uid}')
        user_data = ref.get()

        if not user_data:
            return jsonify({"status": "new_user", "message": "Please provide Email & Name."})
        
        if user_data.get('emailVerified') is True:
            return jsonify({"status": "login_success", "user": user_data})
        else:
            return jsonify({"status": "email_pending", "message": "Please verify email."})

    except Exception as e:
        return jsonify({"error": str(e)}), 401

# 2. SEND EMAIL OTP
@auth_bp.route('/send-email-otp', methods=['POST'])
def send_email_otp():
    data = request.json
    id_token = data.get('idToken')
    email = data.get('email')

    try:
        decoded = auth.verify_id_token(id_token)
        uid = decoded['uid']
        
        # Simple security: Check admin secret code during signup 
        if data.get('role') == 'admin':
            if data.get('secretCode') != ADMIN_SECRET_CODE:
                return jsonify({"error": "Invalid Secret Code"}), 403

        # Generate OTP and store in Realtime Database temp node 
        otp = ''.join(random.choices(string.digits, k=6))
        db.reference(f'temp_otps/{uid}').set({
            "code": otp,
            "email": email,
            "expires_at": (datetime.datetime.now() + datetime.timedelta(minutes=10)).timestamp()
        })

        body = f"Your Verification Code: {otp}"
        if send_smtp_email(email, "Verify Your Account", body):
            return jsonify({"success": True})
        return jsonify({"error": "Failed to send email"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 401

# 3. FINALIZE & STORE DATA: Final step to save user to Realtime Database
@auth_bp.route('/finalize-auth', methods=['POST'])
def finalize_auth():
    data = request.json
    id_token = data.get('idToken')
    otp_input = data.get('otp')
    role = data.get('role')

    try:
        decoded = auth.verify_id_token(id_token)
        uid = decoded['uid']

        # Verify the Email OTP stored in Database 
        otp_ref = db.reference(f'temp_otps/{uid}')
        otp_data = otp_ref.get()

        if not otp_data or str(otp_data['code']) != str(otp_input):
            return jsonify({"error": "Invalid OTP"}), 400

        # Update User Profile in Realtime Database 
        user_ref = db.reference(f'users/{role}s/{uid}')
        update_data = {
            "uid": uid,
            "phoneNumber": decoded.get('phone_number'),
            "email": otp_data['email'],
            "emailVerified": True,
            "role": role,
            "lastLogin": datetime.datetime.now().isoformat()
        }
        
        # Add signup-specific info 
        if not user_ref.get():
            update_data["name"] = data.get('fullName', 'Anonymous')
            update_data["joinedAt"] = datetime.datetime.now().isoformat()
        
        user_ref.update(update_data)
        otp_ref.delete() # Cleanup OTP

        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 401