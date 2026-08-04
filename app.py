from flask import Flask, render_template, request, jsonify
import sys
import os

# Allow app.py to import files from src/
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

from predictor import predict_top3
from api_formatter import format_prediction_response
from contact_handler import save_contact_message
from feedback_handler import save_feedback

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/v1/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Skills selected from frontend
        selected_skills = data.get("selectedSkills", [])

        # Convert list -> dictionary
        skills_dict = {skill: 1 for skill in selected_skills}

        # Get Top 3 Predictions
        top3 = predict_top3(skills_dict)

        response = format_prediction_response(top3, skills_dict)

        return jsonify(response)

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/v1/contact", methods=["POST"])
def contact():
    try:
        data = request.get_json()

        if data is None:
            return jsonify({"success": False, "error": "Invalid request body."}), 400

        result = save_contact_message(data)

        if not result["success"]:
            # Validation failed — 400, not 500, since this is the user's input
            return jsonify(result), 400

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/v1/feedback", methods=["POST"])
def feedback():
    try:
        data = request.get_json()

        if data is None:
            return jsonify({"success": False, "error": "Invalid request body."}), 400

        result = save_feedback(data)

        if not result["success"]:
            # Validation failed — 400, not 500, since this is the user's input
            return jsonify(result), 400

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)