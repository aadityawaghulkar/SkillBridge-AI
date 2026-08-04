"""
feedback_handler.py
Handles the Feedback form: validates submitted data and saves it to
data/feedbacks.csv. Same architecture as contact_handler.py — kept
separate from app.py so app.py stays a thin routing layer.
"""

import os
import csv
from datetime import datetime

# ---------------------------------------------------------
# Paths — same BASE_DIR pattern as contact_handler.py / preprocessing.py.
# ---------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
FEEDBACKS_PATH = os.path.join(DATA_DIR, "feedbacks.csv")

CSV_HEADERS = [
    "ID", "Name", "Email", "Rating", "Category",
    "Feedback", "Suggestion", "Submitted Date", "Submitted Time"
]

# Must match the <option value="..."> values in the feedback form's
# Category dropdown — kept here so an invalid/tampered value gets caught.
VALID_CATEGORIES = {
    "prediction_accuracy",
    "ui_ux",
    "missing_skills",
    "feature_request",
}


def _ensure_csv_exists():
    """Create data/feedbacks.csv with headers if it doesn't exist yet."""
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(FEEDBACKS_PATH):
        with open(FEEDBACKS_PATH, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(CSV_HEADERS)


def _get_next_id():
    """Read the CSV and return the next sequential ID (1 if file is empty)."""
    _ensure_csv_exists()
    with open(FEEDBACKS_PATH, "r", newline="", encoding="utf-8") as f:
        rows = list(csv.reader(f))
    # rows[0] is the header row, so len(rows) - 1 = number of existing entries
    return len(rows)


def validate_feedback_data(data):
    """
    Validate the incoming feedback payload.
    Required: name, rating, feedback (comment).
    Optional: email, suggestion. Category defaults if missing/invalid.
    Returns (is_valid: bool, error_message: str or None).
    """
    name = (data.get("name") or "").strip()
    feedback_text = (data.get("feedback") or "").strip()
    rating = data.get("rating")

    if not name:
        return False, "Name is required."
    if len(name) > 100:
        return False, "Name must be under 100 characters."

    if rating is None or str(rating).strip() == "":
        return False, "Rating is required."
    try:
        rating_int = int(rating)
    except (TypeError, ValueError):
        return False, "Rating must be a number between 1 and 5."
    if rating_int < 1 or rating_int > 5:
        return False, "Rating must be between 1 and 5."

    if not feedback_text:
        return False, "Feedback is required."
    if len(feedback_text) > 2000:
        return False, "Feedback must be under 2000 characters."

    # Optional fields — still cap lengths if provided
    email = (data.get("email") or "").strip()
    if email and ("@" not in email or "." not in email.split("@")[-1]):
        return False, "Please enter a valid email address."

    suggestion = (data.get("suggestion") or "").strip()
    if len(suggestion) > 1000:
        return False, "Suggestion must be under 1000 characters."

    return True, None


def save_feedback(data):
    """
    Validates and appends a feedback entry to data/feedbacks.csv.
    Returns a dict describing the result — the route just forwards this as JSON.
    """
    is_valid, error = validate_feedback_data(data)
    if not is_valid:
        return {"success": False, "error": error}

    _ensure_csv_exists()

    # Fall back to a default category if missing/unrecognized, rather
    # than rejecting the whole submission over a dropdown value.
    category = (data.get("category") or "").strip()
    if category not in VALID_CATEGORIES:
        category = "feature_request"

    now = datetime.now()
    row = [
        _get_next_id(),
        data.get("name", "").strip(),
        data.get("email", "").strip(),
        int(data.get("rating")),
        category,
        data.get("feedback", "").strip(),
        data.get("suggestion", "").strip(),
        now.strftime("%Y-%m-%d"),
        now.strftime("%H:%M:%S"),
    ]

    with open(FEEDBACKS_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(row)

    return {"success": True, "message": "Thank you for your feedback!"}
