"""
preprocessing.py
Shared data-loading and preprocessing utilities used by both
train_model.py (training time) and predictor.py (inference time).
Keeping this logic in one place guarantees train/predict never drift apart.
"""

import os
import pandas as pd
import pickle

# ---------------------------------------------------------
# Paths (relative to src/, matching project structure)
# ---------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODELS_DIR = os.path.join(BASE_DIR, "models")

STUDENT_SKILLS_PATH = os.path.join(DATA_DIR, "student_skills.csv")
CAREER_REQUIREMENTS_PATH = os.path.join(DATA_DIR, "career_requirements.csv")
SKILL_LEARNING_TIME_PATH = os.path.join(DATA_DIR, "skill_learning_time.csv")

MODEL_PATH = os.path.join(MODELS_DIR, "skill_model.pkl")
LABEL_ENCODER_PATH = os.path.join(MODELS_DIR, "label_encoder.pkl")
SCALER_PATH = os.path.join(MODELS_DIR, "scaler.pkl")
FEATURE_COLUMNS_PATH = os.path.join(MODELS_DIR, "feature_columns.pkl")


def load_student_data():
    df = pd.read_csv(STUDENT_SKILLS_PATH)

    # Ignore ID and target column
    feature_columns = [
        c for c in df.columns
        if c not in ["Student_ID", "Career"]
    ]

    X = df[feature_columns]
    y = df["Career"]

    return X, y, feature_columns


def load_career_requirements():
    df = pd.read_csv(CAREER_REQUIREMENTS_PATH)

    requirements = {}

    for _, row in df.iterrows():

        required = [
            s.strip()
            for s in str(row["Required Skills"]).split(",")
        ]

        optional = [
            s.strip()
            for s in str(row["Optional Skills"]).split(",")
        ]

        requirements[row["Career"]] = {
            "required": required,
            "optional": optional
        }

    return requirements


def load_skill_learning_time():
    df = pd.read_csv(SKILL_LEARNING_TIME_PATH)

    # We'll use JobReady weeks for roadmap estimation
    return dict(
        zip(
            df["Skill"],
            df["JobReady_Weeks"]
        )
    )


def parse_weeks(value):
    return int(value)


def save_artifacts(model, label_encoder, scaler, feature_columns):
    """Save all 4 trained artifacts to models/ with the project's exact filenames."""
    os.makedirs(MODELS_DIR, exist_ok=True)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)
    with open(LABEL_ENCODER_PATH, "wb") as f:
        pickle.dump(label_encoder, f)
    with open(SCALER_PATH, "wb") as f:
        pickle.dump(scaler, f)
    with open(FEATURE_COLUMNS_PATH, "wb") as f:
        pickle.dump(feature_columns, f)


def load_artifacts():
    """Load all 4 trained artifacts from models/. Returns (model, label_encoder, scaler, feature_columns)."""
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    with open(LABEL_ENCODER_PATH, "rb") as f:
        label_encoder = pickle.load(f)
    with open(SCALER_PATH, "rb") as f:
        scaler = pickle.load(f)
    with open(FEATURE_COLUMNS_PATH, "rb") as f:
        feature_columns = pickle.load(f)
    return model, label_encoder, scaler, feature_columns


def skills_dict_to_dataframe(skills_dict, feature_columns):
    """Convert a {skill_name: 0/1} dict into a single-row DataFrame in the correct column order."""
    values = [skills_dict.get(skill, 0) for skill in feature_columns]
    return pd.DataFrame([values], columns=feature_columns)