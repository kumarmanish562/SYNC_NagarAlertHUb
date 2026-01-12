import firebase_admin
from firebase_admin import credentials, storage
import os
from dotenv import load_dotenv
from pathlib import Path

# Load env
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

print("--- Testing Firebase Storage Upload ---")

# Init Firebase
cred_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH') or 'serviceAccountKey.json'
bucket_name = os.getenv('FIREBASE_STORAGE_BUCKET')

print(f"Cred Path: {cred_path}")
print(f"Bucket Name: {bucket_name}")

if not os.path.exists(cred_path):
    print("ERROR: Service account file not found!")
    exit(1)

try:
    cred = credentials.Certificate(cred_path)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred, {
            'storageBucket': bucket_name
        })
    
    bucket = storage.bucket()
    print(f"Bucket object: {bucket}")
    print(f"Bucket name from object: {bucket.name}")
    
    # Create a dummy file
    blob = bucket.blob("test_upload.txt")
    blob.upload_from_string("Hello World")
    blob.make_public()
    print(f"Upload success! URL: {blob.public_url}")

except Exception as e:
    print(f"\nCRITICAL ERROR: {e}")
    import traceback
    traceback.print_exc()
