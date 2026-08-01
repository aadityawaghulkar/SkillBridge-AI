from flask import Flask, render_template, request, jsonify
import sys
import os

# Allow app.py to import files from src/
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

from predictor import (
    predict_top3,
    skill_gap_analysis,
    compare_dream_vs_predicted
)
from recommendation import build_learning_roadmap

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

        top_matches = []

        for career_name, confidence in top3:

            gap = skill_gap_analysis(skills_dict, career_name)

            roadmap_data = build_learning_roadmap(
                gap["missing_skills"]
            )

            roadmap = []

            for item in roadmap_data:
                roadmap.append({
                "title": item["skill"],
                "meta": f"Week {item['start_week']}-{item['end_week']} ({item['weeks']} Weeks)"
            })

            top_matches.append({

                "title": career_name,

                "matchPercentage": round(gap["readiness_percent"]),
                "overallReadinessPct": round(gap["readiness_percent"]),

                "coreSkillsMatchedStr":
                    f'{gap["matched_count"]}/{gap["total_required"]}',

                "estimatedLearningTime":
                    f'{gap["estimated_total_weeks"]} Weeks',

                "modelConfidence": f"{confidence:.1f}%",

                "missingMustHave":
                    gap["missing_skills"],

                "missingGoodToHave": [],

                "missingOptional": [],

                "roadmap": roadmap

            })

        return jsonify({
        "success": True,
        "topMatches": top_matches
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True)