from fastapi import APIRouter, Query
from typing import Dict, Any

router = APIRouter(prefix="/weather", tags=["Weather"])

@router.get("", response_model=Dict[str, Any])
def get_weather(district: str = Query("Guntur")):
    return {
        "district": district,
        "state": "Andhra Pradesh",
        "temperature_c": 32.4,
        "condition": "Partly Cloudy",
        "humidity_pct": 68,
        "rainfall_mm": 2.5,
        "wind_speed_kmh": 14,
        "forecast_summary": "Light isolated rains expected over the next 48 hours in Guntur & NTR districts.",
        "agricultural_impact": {
            "chilli": "Favorable conditions for pod drying in open yards. Ensure tarpaulins are accessible if short rainfall occurs.",
            "turmeric": "High humidity is beneficial for turmeric rhizome curing and boiling processing."
        },
        "data_source": "SIMULATED_DEMO_WEATHER_SERVICE"
    }
