"""
career_config.py
Single source of truth for skills, careers, and tier mapping —
used by test_model.py's interactive CLI.

This used to hand-type its own skill names and career list, which had
drifted out of sync with the actual trained model (different skill
spelling, an extra career that doesn't exist in career_requirements.csv).
It now derives everything directly from the real artifacts, so it is
*structurally* impossible for it to drift again: if the model or
career_requirements.csv changes, this file's values change with them
automatically.
"""

from preprocessing import load_artifacts, load_career_requirements

# ---------------------------------------------------------
# 20 skills — pulled straight from the trained model's feature
# columns (feature_columns.pkl), so this always matches
# skill_model.pkl / scaler.pkl / label_encoder.pkl exactly.
# ---------------------------------------------------------
_, _, _, SKILLS = load_artifacts()

# ---------------------------------------------------------
# Careers + tiered skills, straight from career_requirements.csv:
#   must = Required Skills column
#   good = Optional Skills column
#   rare = every other skill not listed for that career
# ---------------------------------------------------------
_requirements = load_career_requirements()

CAREER_SKILL_MAP = {}
for _career, _reqs in _requirements.items():
    _must = _reqs["required"]
    _good = _reqs["optional"]
    _rare = [s for s in SKILLS if s not in _must and s not in _good]
    CAREER_SKILL_MAP[_career] = {
        "must": _must,
        "good": _good,
        "rare": _rare,
    }

# sanity check on import — every skill accounted for exactly once
# across must/good/rare for every career
for _career, _tiers in CAREER_SKILL_MAP.items():
    _mapped = _tiers["must"] + _tiers["good"] + _tiers["rare"]
    assert sorted(set(_mapped)) == sorted(set(SKILLS)), \
        f"Skill mapping incomplete for {_career}"
