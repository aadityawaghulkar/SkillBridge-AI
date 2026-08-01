"""
career_config.py
Single source of truth for skills, careers, and tier mapping.
Imported by all three generator scripts so student_skills.csv,
career_requirements.csv, and skill_learning_time.csv can never drift
out of sync with each other.
"""

# ---------------------------------------------------------
# 20 skills — final list (docker added, 'c' removed, no changes needed
# in preprocessing/LabelEncoder/StandardScaler/train_model.py/predictor.py)
# ---------------------------------------------------------
SKILLS = [
    "python", "java", "cpp", "sql", "html", "css", "javascript",
    "react", "nodejs", "machine_learning", "deep_learning", "data_analysis",
    "git", "linux", "cloud", "excel", "power_bi",
    "communication", "problem_solving", "teamwork"
]

# ---------------------------------------------------------
# Probability ranges per tier (tuned for KNN separability —
# see silhouette/accuracy validation done earlier)
# ---------------------------------------------------------
TIER_RANGES = {
    "must":     (0.93, 1.00),
    "good":     (0.65, 0.85),
    "optional": (0.15, 0.30),
    "rare":     (0.02, 0.08),
}

# ---------------------------------------------------------
# 9 final careers, each skill assigned to exactly one tier
# ---------------------------------------------------------
CAREER_SKILL_MAP = {
    "AI / Machine Learning Engineer": {
        "must":     ["python", "machine_learning", "deep_learning", "git",
                      "communication", "problem_solving", "teamwork"],
        "good":     ["sql", "data_analysis", "linux", "cloud"],
        "optional": ["java", "cpp", "excel", "power_bi", "javascript"],
        "rare":     ["html", "css", "react", "nodejs"],
    },
    "Machine Learning Engineer": {
        "must":     ["python", "machine_learning", "git",
                      "communication", "problem_solving", "teamwork"],
        "good":     ["deep_learning", "sql", "data_analysis", "linux", "cloud"],
        "optional": ["java", "cpp", "excel", "power_bi"],
        "rare":     ["html", "css", "javascript", "react", "nodejs"],
    },
    "Data Scientist": {
        "must":     ["python", "data_analysis", "sql",
                      "communication", "problem_solving", "teamwork"],
        "good":     ["machine_learning", "excel", "power_bi", "git"],
        "optional": ["deep_learning", "linux", "java", "cloud"],
        "rare":     ["html", "css", "javascript", "react", "nodejs", "cpp"],
    },
    "Data Analyst": {
        "must":     ["sql", "excel", "data_analysis", "communication", "teamwork"],
        "good":     ["power_bi", "python", "problem_solving"],
        "optional": ["machine_learning", "git", "java"],
        "rare":     ["deep_learning", "cpp", "html", "css", "javascript",
                      "react", "nodejs", "linux", "cloud"],
    },
    "Backend Developer": {
        "must":     ["java", "sql", "git", "problem_solving"],
        "good":     ["nodejs", "linux", "python", "communication", "teamwork"],
        "optional": ["cloud", "javascript", "cpp"],
        "rare":     ["html", "css", "react", "machine_learning",
                      "deep_learning", "data_analysis", "excel", "power_bi"],
    },
    "Frontend Developer": {
        "must":     ["html", "css", "javascript", "git",
                      "communication", "problem_solving", "teamwork"],
        "good":     ["react", "nodejs"],
        "optional": ["java", "sql", "cloud"],
        "rare":     ["cpp", "machine_learning", "deep_learning", "data_analysis",
                      "linux", "excel", "power_bi", "python"],
    },
    "Full Stack Developer": {
        "must":     ["html", "css", "javascript", "sql", "git",
                      "communication", "problem_solving", "teamwork"],
        "good":     ["react", "nodejs", "python", "java", "linux"],
        "optional": ["cloud", "cpp", "data_analysis"],
        "rare":     ["machine_learning", "deep_learning", "excel", "power_bi"],
    },
    "Software Developer": {
        "must":     ["java", "cpp", "problem_solving", "git"],
        "good":     ["python", "sql", "communication", "teamwork"],
        "optional": ["javascript", "html", "css", "linux", "cloud"],
        "rare":     ["machine_learning", "deep_learning", "data_analysis",
                      "react", "nodejs", "excel", "power_bi"],
    },
    "DevOps Engineer": {
        "must":     ["linux", "cloud", "git",
                      "communication", "problem_solving", "teamwork"],
        "good":     ["python", "sql", "java"],
        "optional": ["cpp", "javascript", "nodejs"],
        "rare":     ["html", "css", "react", "machine_learning",
                      "deep_learning", "data_analysis", "excel", "power_bi"],
    },
}

# sanity check on import
for _career, _tiers in CAREER_SKILL_MAP.items():
    _mapped = _tiers["must"] + _tiers["good"] + _tiers["optional"] + _tiers["rare"]
    assert sorted(_mapped) == sorted(SKILLS), f"Skill mapping incomplete for {_career}"
    assert len(_mapped) == 20, f"Wrong skill count for {_career}"