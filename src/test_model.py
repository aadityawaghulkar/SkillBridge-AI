"""
test_model.py

Interactive testing for the trained Skill Gap Analyzer model.

Run:
python src/test_model.py
"""

from predictor import (
    predict_top3,
    skill_gap_analysis,
    compare_dream_vs_predicted,
)

from recommendation import (
    build_learning_roadmap,
    summarize_roadmap,
)

from career_config import SKILLS, CAREER_SKILL_MAP


def get_student_skills():
    """Take binary input (0/1) for every skill."""

    print("=" * 60)
    print("ENTER STUDENT SKILLS")
    print("=" * 60)
    print("Enter 1 = Yes, 0 = No\n")

    skills = {}

    for skill in SKILLS:
        while True:
            value = input(f"{skill:<20} (0/1): ").strip()

            if value in ("0", "1"):
                skills[skill] = int(value)
                break

            print("Please enter only 0 or 1.")

    return skills


def get_dream_career():
    """Allow user to choose a dream career."""

    careers = list(CAREER_SKILL_MAP.keys())

    print("\n" + "=" * 60)
    print("SELECT DREAM CAREER")
    print("=" * 60)

    for i, career in enumerate(careers, start=1):
        print(f"{i}. {career}")

    while True:
        choice = input("\nEnter choice: ").strip()

        if choice.isdigit():
            choice = int(choice)

            if 1 <= choice <= len(careers):
                return careers[choice - 1]

        print("Invalid choice. Try again.")


def main():

    skills = get_student_skills()

    dream_career = get_dream_career()

    result = compare_dream_vs_predicted(
        skills,
        dream_career,
    )

    print("\n" + "=" * 60)
    print("TOP 3 CAREER PREDICTIONS")
    print("=" * 60)

    for i, (career, confidence) in enumerate(result["top3_predictions"], start=1):
        print(f"{i}. {career:<30} {confidence:.2f}%")

    print("\nPredicted Career :", result["predicted_career"])
    print("Dream Career     :", result["dream_career"])

    print("\n" + "=" * 60)
    print("DREAM CAREER ANALYSIS")
    print("=" * 60)

    dream_gap = result["dream_career_gap"]

    print(f"Readiness : {dream_gap['readiness_percent']}%")

    print("\nMissing Skills:")

    if dream_gap["missing_skills"]:
        for skill in dream_gap["missing_skills"]:
            print("-", skill)
    else:
        print("None")

    roadmap = build_learning_roadmap(
        dream_gap["missing_skills"]
    )

    print("\nLearning Roadmap")
    print("-" * 60)
    print(summarize_roadmap(roadmap))

    print("\n" + "=" * 60)
    print("PREDICTED CAREER ANALYSIS")
    print("=" * 60)

    predicted_gap = result["predicted_career_gap"]

    print(f"Readiness : {predicted_gap['readiness_percent']}%")

    print("\nMissing Skills:")

    if predicted_gap["missing_skills"]:
        for skill in predicted_gap["missing_skills"]:
            print("-", skill)
    else:
        print("None")


if __name__ == "__main__":
    main()