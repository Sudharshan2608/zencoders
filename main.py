from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# Allow your frontend to call the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict to ["http://127.0.0.1:5500"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class SymptomData(BaseModel):
    age: int
    symptoms: List[str]
    symptom_duration_days: int
    severity: str
    recent_exposure: str
    pre_existing_conditions: List[str]
    medications: Optional[str] = None
    temperature: Optional[float] = None
    oxygen_saturation: Optional[int] = None
    heart_rate: Optional[int] = None

# Dummy triage logic
@app.post("/triage")
def triage(data: SymptomData):
    urgency = "Low"
    reason = "Your symptoms appear mild and stable."

    if data.severity == "severe" or "chest pain" in data.symptoms or "shortness of breath" in data.symptoms:
        urgency = "High"
        reason = "You have severe symptoms that may require urgent attention."

    elif data.severity == "moderate" or data.symptom_duration_days > 7:
        urgency = "Medium"
        reason = "Your symptoms suggest you may need a medical evaluation soon."

    if data.oxygen_saturation and data.oxygen_saturation < 94:
        urgency = "High"
        reason = "Low oxygen levels detected."

    if data.temperature and data.temperature > 39:
        urgency = "High"
        reason = "High fever detected."

    disclaimer = "This is not medical advice. Please consult a licensed healthcare provider."

    return {
        "urgency": urgency,
        "reason": reason,
        "disclaimer": disclaimer
    }
