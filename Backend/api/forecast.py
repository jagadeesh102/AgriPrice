from fastapi import APIRouter, HTTPException
from Backend.models.schemas import ForecastRequest, ForecastResponse
from Backend.ml.model import ml_service

router = APIRouter(prefix="/forecast", tags=["Price Forecasting"])

@router.post("", response_model=ForecastResponse)
def generate_forecast(req: ForecastRequest):
    if req.forecast_days not in [7, 15, 30, 60, 90]:
        # Default to 15 if not standard
        forecast_days = 15
    else:
        forecast_days = req.forecast_days

    quantity = req.quantity_quintals if req.quantity_quintals and req.quantity_quintals > 0 else 10.0

    try:
        res = ml_service.predict_forecast(
            crop=req.crop,
            market=req.market,
            forecast_days=forecast_days,
            quantity=quantity
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction service error: {str(e)}")
