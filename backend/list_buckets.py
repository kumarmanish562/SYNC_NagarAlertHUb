from firebase_admin import storage, credentials, initialize_app
import firebase_admin
import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

cred_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH') or 'serviceAccountKey.json'
cred = credentials.Certificate(cred_path)

# Try init without bucket
if not firebase_admin._apps:
    initialize_app(cred)

print("--- Listing Buckets ---")
try:
    # Use GCS client underneath
    from google.cloud import storage as gcs
    client = gcs.Client.from_service_account_json(cred_path)
    for bucket in client.list_buckets():
        print(f"Found Bucket: {bucket.name}")
except Exception as e:
    print(f"Error listing: {e}")
