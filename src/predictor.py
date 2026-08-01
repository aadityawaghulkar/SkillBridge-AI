"""
predictor.py
Given a student's skill dict, returns Top-3 predicted careers with
confidence %, and a skill-gap analysis (missing skills, readiness %,
estimated learning time) against any target career.
"""

import pandas as pd

from preprocessing import (
    load_artifacts,
    load_career_requirements,
    load_skill_learning_time,
    parse_weeks,
    skills_dict_to_dataframe,
)

# Load everything once at import time
model, label_encoder, scaler, feature_columns = load_artifacts()
career_requirements = load_career_requirements()
skill_time = load_skill_learning_time()


def predict_top3(skills_dict):
    """
    skills_dict: {"python": 1, "sql": 0, ...}
    Returns: [(career_name, confidence_percent), ...] top 3, highest first.
    """
    vector_df = skills_dict_to_dataframe(skills_dict, feature_columns)
    vector_scaled = scaler.transform(vector_df)

    proba = model.predict_proba(vector_scaled)[0]
    careers = label_encoder.classes_

    ranked = sorted(zip(careers, proba), key=lambda x: x[1], reverse=True)
    return [(career, round(prob * 100, 2)) for career, prob in ranked[:3]]


def skill_gap_analysis(skills_dict, target_career):
    """
    Compare student's skills against the target career requirements.
    """

    if target_career not in career_requirements:
        raise ValueError(f"Unknown career: {target_career}")

    required_skills = career_requirements[target_career]["required"]

    missing_skills = [
        skill for skill in required_skills
        if skills_dict.get(skill, 0) == 0
    ]

    matched_count = len(required_skills) - len(missing_skills)

    readiness_percent = (
        round((matched_count / len(required_skills)) * 100, 1)
        if required_skills else 0
    )

    total_weeks = sum(
        parse_weeks(skill_time.get(skill, 0))
        for skill in missing_skills
    )

    return {
        "target_career": target_career,
        "required_skills": required_skills,
        "missing_skills": missing_skills,
        "matched_count": matched_count,
        "total_required": len(required_skills),
        "readiness_percent": readiness_percent,
        "estimated_total_weeks": total_weeks,
    }


def compare_dream_vs_predicted(skills_dict, dream_career):
    """
    Runs the model's top prediction AND a gap analysis against the user's
    stated dream career, returning both side by side.
    """
    top3 = predict_top3(skills_dict)
    predicted_career = top3[0][0]

    return {
        "top3_predictions": top3,
        "predicted_career": predicted_career,
        "dream_career": dream_career,
        "dream_career_gap": skill_gap_analysis(skills_dict, dream_career),
        "predicted_career_gap": skill_gap_analysis(skills_dict, predicted_career),
    }