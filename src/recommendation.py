"""
recommendation.py
Builds a prioritized learning roadmap from a skill_gap_analysis() result:
orders missing skills by learning time (shortest first, for quick wins),
and groups them into weekly phases.
"""

from preprocessing import load_skill_learning_time, parse_weeks

skill_time = load_skill_learning_time()


def build_learning_roadmap(missing_skills):
    """
    missing_skills: list of skill names (e.g. from skill_gap_analysis()['missing_skills'])
    Returns: list of {skill, weeks, start_week, end_week} sorted shortest-first,
             sequenced back-to-back so the roadmap is a realistic week-by-week plan.
    """
    # sort shortest-to-learn first: quick wins build momentum early
    sorted_skills = sorted(missing_skills, key=lambda s: parse_weeks(skill_time.get(s, "0 weeks")))

    roadmap = []
    current_week = 1
    for skill in sorted_skills:
        weeks = parse_weeks(skill_time.get(skill, "0 weeks"))
        roadmap.append({
            "skill": skill,
            "weeks": weeks,
            "start_week": current_week,
            "end_week": current_week + weeks - 1,
        })
        current_week += weeks

    return roadmap


def summarize_roadmap(roadmap):
    """Human-readable summary string for display in the UI."""
    if not roadmap:
        return "No skill gap — you're fully ready for this career!"

    total_weeks = roadmap[-1]["end_week"]
    lines = [f"Total estimated time: {total_weeks} weeks\n"]
    for item in roadmap:
        lines.append(f"  Week {item['start_week']}-{item['end_week']}: {item['skill']} ({item['weeks']} wks)")
    return "\n".join(lines)