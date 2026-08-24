from fastapi import APIRouter
from Backend.models.schemas import RevenueCalculatorRequest, RevenueCalculatorResponse

router = APIRouter(prefix="/revenue", tags=["Revenue Calculator"])

@router.post("/calculate", response_model=RevenueCalculatorResponse)
def calculate_revenue(req: RevenueCalculatorRequest):
    qty = max(0.1, req.quantity_quintals)
    
    current_gross = qty * req.current_price
    future_gross = qty * req.expected_future_price

    total_transport = qty * req.transport_cost_per_quintal
    total_storage = qty * req.storage_cost_per_quintal_month * req.holding_months

    current_net = current_gross - total_transport
    future_net = future_gross - total_transport - total_storage

    net_diff = future_net - current_net
    roi_pct = ((future_net - current_net) / current_net * 100) if current_net > 0 else 0.0

    return {
        "current_gross_revenue": round(current_gross, 2),
        "future_gross_revenue": round(future_gross, 2),
        "total_transport_cost": round(total_transport, 2),
        "total_storage_cost": round(total_storage, 2),
        "current_net_revenue": round(current_net, 2),
        "future_net_revenue": round(future_net, 2),
        "estimated_net_difference": round(net_diff, 2),
        "roi_percentage": round(roi_pct, 2)
    }
