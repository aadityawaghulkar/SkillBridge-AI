from predictor import skill_gap_analysis
from recommendation import build_learning_roadmap


def format_prediction_response(top3_predictions, skills_dict):
    """
    Convert predictor output into the JSON format expected by the frontend.
    """

    top_matches = []

    for career_name, confidence in top3_predictions:

        # Skill Gap Analysis
        gap = skill_gap_analysis(skills_dict, career_name)

        # Learning Roadmap
        roadmap_data = build_learning_roadmap(gap["missing_skills"])

        # Convert roadmap into frontend format
        roadmap = []

        for item in roadmap_data:
            roadmap.append({
                "title": item["skill"],
                "meta": f"Week {item['start_week']}-{item['end_week']} ({item['weeks']} Weeks)"
            })

        # Build frontend response object
        top_matches.append({

            "title": career_name,

            "matchPercentage": round(confidence),

            "overallReadinessPct": round(gap["readiness_percent"]),

            "coreSkillsMatchedStr":
                f"{gap['matched_count']}/{gap['total_required']}",

            "estimatedLearningTime":
                f"{gap['estimated_total_weeks']} Weeks",

            "modelConfidence":
                f"{confidence:.1f}%",

            "missingMustHave":
                gap["missing_skills"],

            "missingGoodToHave":
                gap["missing_optional_skills"],

            # No third skill tier exists in career_requirements.csv
            # (only Required/Optional), so there's nothing real to put
            # here yet. Left empty rather than duplicating
            # missingGoodToHave or inventing data.
            "missingOptional": [],

            "roadmap": roadmap

        })

    return {
        "success": True,
        "topMatches": top_matches
    }