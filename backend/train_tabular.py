# backend/train_tabular.py
import os
import argparse
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
import pickle

def find_label_column(df):
    candidates = ['main.disorder', 'specific.disorder', 'label', 'class', 'diagnosis']
    for c in candidates:
        if c in df.columns:
            return c
    # fallback: choose first non-numeric column
    for c in df.columns:
        if not pd.api.types.is_numeric_dtype(df[c]):
            return c
    raise ValueError("Could not find a label column. Please pass --label_col")

def main(args):
    df = pd.read_csv(args.input_csv)
    label_col = args.label_col or find_label_column(df)
    print("Using label column:", label_col)

    # ✅ Force binary labels
    y_raw = df[label_col].astype(str)
    y_binary = y_raw.apply(lambda v: "Healthy" if "healthy" in v.lower() else "At Risk")

    le = LabelEncoder()
    y_enc = le.fit_transform(y_binary)

    # ✅ Numeric features
    X = df.select_dtypes(include=[np.number]).copy()
    if X.shape[1] == 0:
        raise RuntimeError("No numeric columns found in CSV. Ensure CSV has numeric features.")
    X = X.fillna(0)

    feature_names = list(X.columns)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_enc, test_size=0.2, random_state=42, stratify=y_enc
    )

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    clf = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1)
    clf.fit(X_train_s, y_train)

    y_pred = clf.predict(X_test_s)
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("Classification report:\n", classification_report(y_test, y_pred, target_names=le.classes_))

    os.makedirs(args.out_dir, exist_ok=True)
    joblib.dump(clf, os.path.join(args.out_dir, "tabular_model.pkl"))
    joblib.dump(scaler, os.path.join(args.out_dir, "tabular_scaler.pkl"))
    joblib.dump(le, os.path.join(args.out_dir, "tabular_label_encoder.pkl"))
    with open(os.path.join(args.out_dir, "tabular_feature_names.pkl"), "wb") as f:
        pickle.dump(feature_names, f)

    print("✅ Saved tabular model artifacts to", args.out_dir)

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--input_csv", required=True, help="Path to labeled CSV")
    p.add_argument("--out_dir", default="models", help="Where to save tabular model artifacts")
    p.add_argument("--label_col", default=None, help="Optional column name for labels")
    args = p.parse_args()
    main(args)
