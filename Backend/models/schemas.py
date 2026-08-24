from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any

# User Auth Schemas
class UserRegister(BaseModel):
    name: str
    mobile: str
    email: str
    password: str
    district: Optional[str] = "Guntur"
    preferred_language: Optional[str] = "en"
    primary_crop: Optional[str] = "chilli"

class UserLogin(BaseModel):
    email_or_mobile: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserProfile(BaseModel):
    id: str
    name: str
    mobile: str
    email: str
    district: str
    preferred_language: str
    primary_crop: str
    is_admin: bool = False

# Forecast Request & Response Schemas
class ForecastRequest(BaseModel):
    crop: str # chilli / turmeric
    market: str # Guntur, Duggirala, etc.
    forecast_days: int = 15 # 7, 15, 30, 60, 90
    quantity_quintals: Optional[float] = 10.0

class PricePoint(BaseModel):
    date: str
    historical_price: Optional[float] = None
    predicted_price: Optional[float] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None

class PartialSellBreakdown(BaseModel):
    sell_now_percentage: int
    hold_percentage: int
    sell_now_quintals: float
    hold_quintals: float
    current_spot_revenue: float
    estimated_future_revenue: float
    total_projected_revenue: float

class ForecastResponse(BaseModel):
    crop: str
    market: str
    forecast_days: int
    current_price: float
    predicted_price: float
    min_price: float
    max_price: float
    percentage_change: float
    confidence_score: int
    recommendation: str # SELL_NOW / WAIT / PARTIAL_SELL
    recommendation_rationale: List[str]
    potential_additional_revenue: float
    partial_sell_advice: PartialSellBreakdown
    price_chart_data: List[PricePoint]
    disclaimer: str

# Revenue Calculator Schema
class RevenueCalculatorRequest(BaseModel):
    crop: str
    quantity_quintals: float
    current_price: float
    expected_future_price: float
    transport_cost_per_quintal: float = 150.0
    storage_cost_per_quintal_month: float = 80.0
    holding_months: float = 0.5

class RevenueCalculatorResponse(BaseModel):
    current_gross_revenue: float
    future_gross_revenue: float
    total_transport_cost: float
    total_storage_cost: float
    current_net_revenue: float
    future_net_revenue: float
    estimated_net_difference: float
    roi_percentage: float

# Notification Schema
class PriceAlertCreate(BaseModel):
    crop: str
    market: str
    target_price: float
    condition: str = "above" # above / below

class NotificationItem(BaseModel):
    id: str
    title: str
    message: str
    type: str # alert / info / warning
    timestamp: str
    read: bool = False
