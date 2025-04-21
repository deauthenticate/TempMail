from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STORAGE_DIR = "emails"

@app.get("/mails/{address}")
def get_inbox(address: str):
    print(f"📨 Incoming request for inbox: {address}") 
    address = address.replace("@", "_at_")
    file_path = os.path.join(STORAGE_DIR, f"{address}.json")
    if not os.path.exists(file_path):
        print("📭 Inbox not found!")  
        raise HTTPException(status_code=404, detail="Inbox not found")
    with open(file_path, 'r') as f:
        emails = json.load(f)
    print(f"📬 Returning {len(emails)} emails.") 
    return emails
