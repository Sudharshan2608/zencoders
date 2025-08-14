# train_model.py
from sklearn.ensemble import RandomForestClassifier
import numpy as np
from joblib import dump

# Example fake dataset: [age, duration_days, severity_code, symptoms_count, conditions_count]
# severity_code: mild=1, moderate=2, severe=3
X = np.array([
    [25, 2, 1, 1, 0],  # Low urgency
    [50, 5, 2, 3, 1],  # Medium
    [75, 1, 3, 5, 2],  # High
    [30, 7, 1, 2, 0],  # Medium
    [60, 3, 3, 1, 2],  # High
])

y = [0, 1, 2, 1, 2]  # 0=Low, 1=Medium, 2=High

# Train random forest
model = RandomForestClassifier()
model.fit(X, y)

# Save model
dump(model, "urgency_model.joblib")
print("Trained urgency_model.joblib saved!")
