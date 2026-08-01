"""
train_model.py

Trains the KNN model for career prediction.
Performs hyperparameter tuning using GridSearchCV,
evaluates the model, and saves trained artifacts.
"""

from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)

from preprocessing import load_student_data, save_artifacts


def main():
    # ---------------------------------------------------------
    # Load Dataset
    # ---------------------------------------------------------
    X, y, feature_columns = load_student_data()

    print("=" * 60)
    print("DATASET INFORMATION")
    print("=" * 60)
    print(f"Total Samples   : {len(X)}")
    print(f"Total Features  : {len(feature_columns)}")
    print(f"Total Careers   : {len(y.unique())}")

    # ---------------------------------------------------------
    # Encode Target Labels
    # ---------------------------------------------------------
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    # ---------------------------------------------------------
    # Train-Test Split
    # ---------------------------------------------------------
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y_encoded,
        test_size=0.20,
        random_state=42,
        stratify=y_encoded,
    )

    print("\nTrain-Test Split")
    print("-" * 30)
    print(f"Training Samples : {len(X_train)}")
    print(f"Testing Samples  : {len(X_test)}")

    # ---------------------------------------------------------
    # Feature Scaling
    # ---------------------------------------------------------
    scaler = StandardScaler()

    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # ---------------------------------------------------------
    # Hyperparameter Tuning
    # ---------------------------------------------------------
    print("\nSearching for Optimal K...")

    param_grid = {
        "n_neighbors": [3, 5, 7, 9, 11, 13, 15]
    }

    grid = GridSearchCV(
        KNeighborsClassifier(),
        param_grid=param_grid,
        cv=5,
        scoring="accuracy",
    )

    grid.fit(X_train_scaled, y_train)

    best_k = grid.best_params_["n_neighbors"]

    print(f"\nOptimal K Value           : {best_k}")
    print(f"Cross Validation Accuracy: {grid.best_score_:.4f}")

    # ---------------------------------------------------------
    # Train Final Model
    # ---------------------------------------------------------
    model = KNeighborsClassifier(n_neighbors=best_k)
    model.fit(X_train_scaled, y_train)

    # ---------------------------------------------------------
    # Predictions
    # ---------------------------------------------------------
    y_pred = model.predict(X_test_scaled)

    # ---------------------------------------------------------
    # Accuracy
    # ---------------------------------------------------------
    train_accuracy = model.score(X_train_scaled, y_train)
    test_accuracy = accuracy_score(y_test, y_pred)

    print("\n" + "=" * 60)
    print("MODEL PERFORMANCE")
    print("=" * 60)

    print(f"Training Accuracy : {train_accuracy:.4f}")
    print(f"Testing Accuracy  : {test_accuracy:.4f}")

    # ---------------------------------------------------------
    # Classification Report
    # ---------------------------------------------------------
    print("\nClassification Report")
    print("-" * 60)

    print(
        classification_report(
            y_test,
            y_pred,
            target_names=label_encoder.classes_,
        )
    )

    # ---------------------------------------------------------
    # Confusion Matrix
    # ---------------------------------------------------------
    cm = confusion_matrix(y_test, y_pred)

    print("\nConfusion Matrix")
    print("-" * 60)
    print(cm)

    # ---------------------------------------------------------
    # Save Model
    # ---------------------------------------------------------
    save_artifacts(
        model,
        label_encoder,
        scaler,
        feature_columns,
    )

    print("\n" + "=" * 60)
    print("MODEL SAVED SUCCESSFULLY")
    print("=" * 60)

    print("✔ skill_model.pkl")
    print("✔ label_encoder.pkl")
    print("✔ scaler.pkl")
    print("✔ feature_columns.pkl")

    print("\nTraining Completed Successfully!")


if __name__ == "__main__":
    main()