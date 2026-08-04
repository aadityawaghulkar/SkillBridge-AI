"""
contact_handler.py
Handles the Contact form: validates submitted data and saves it to
data/contacts.csv. Kept separate from app.py so app.py can stay a
thin routing layer (same pattern as predictor.py / recommendation.py).
"""

import os
import csv
from datetime import datetime

# ---------------------------------------------------------
# Paths — same BASE_DIR pattern used in preprocessing.py, so this
# always points at the project's real data/ folder regardless of
# where the app is run from.
# ---------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
CONTACTS_PATH = os.path.join(DATA_DIR, "contacts.csv")

CSV_HEADERS = ["ID", "Name", "Email", "Subject", "Message", "Submitted Date", "Submitted Time"]


def _ensure_csv_exists():
    """Create data/contacts.csv with headers if it doesn't exist yet."""
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(CONTACTS_PATH):
        with open(CONTACTS_PATH, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(CSV_HEADERS)


def _get_next_id():
    """Read the CSV and return the next sequential ID (1 if file is empty)."""
    _ensure_csv_exists()
    with open(CONTACTS_PATH, "r", newline="", encoding="utf-8") as f:
        rows = list(csv.reader(f))
    # rows[0] is the header row, so len(rows) - 1 = number of existing messages
    return len(rows)


def validate_contact_data(data):
    """
    Validate the incoming contact payload.
    Returns (is_valid: bool, error_message: str or None).
    """
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()

    if not name:
        return False, "Name is required."
    if len(name) > 100:
        return False, "Name must be under 100 characters."

    if not email:
        return False, "Email is required."
    # Simple, dependency-free email shape check (not a full RFC validator)
    if "@" not in email or "." not in email.split("@")[-1]:
        return False, "Please enter a valid email address."

    if not message:
        return False, "Message is required."
    if len(message) > 2000:
        return False, "Message must be under 2000 characters."

    # Subject is optional, but still cap its length if provided
    subject = (data.get("subject") or "").strip()
    if len(subject) > 150:
        return False, "Subject must be under 150 characters."

    return True, None


def save_contact_message(data):
    """
    Validates and appends a contact message to data/contacts.csv.
    Returns a dict describing the result — the route just forwards this as JSON.
    """
    is_valid, error = validate_contact_data(data)
    if not is_valid:
        return {"success": False, "error": error}

    _ensure_csv_exists()

    now = datetime.now()
    row = [
        _get_next_id(),
        data.get("name", "").strip(),
        data.get("email", "").strip(),
        data.get("subject", "").strip(),
        data.get("message", "").strip(),
        now.strftime("%Y-%m-%d"),
        now.strftime("%H:%M:%S"),
    ]

    with open(CONTACTS_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(row)

    return {"success": True, "message": "Message sent successfully! We'll get back to you soon."}
