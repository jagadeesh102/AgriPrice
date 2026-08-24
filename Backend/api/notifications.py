from fastapi import APIRouter
from typing import List, Dict, Any
from datetime import datetime
from Backend.models.schemas import PriceAlertCreate
from Backend.database.sqlite_db import get_db_connection

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[Dict[str, Any]])
def get_notifications():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM notifications ORDER BY timestamp DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.post("/alert")
def create_price_alert(alert: PriceAlertCreate):
    conn = get_db_connection()
    cursor = conn.cursor()

    alert_id = f"alert_{int(datetime.now().timestamp())}"
    notif_id = f"notif_{int(datetime.now().timestamp())}"

    cursor.execute('''
        INSERT INTO alerts (id, crop, market, target_price, condition, created_at, active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (alert_id, alert.crop.lower(), alert.market, alert.target_price, alert.condition, "Today, 10:00 AM", 1))

    cursor.execute('''
        INSERT INTO notifications (id, title, message, type, timestamp, read)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        notif_id,
        "Target Price Alert Set",
        f"Alert active for {alert.crop.title()} in {alert.market} when price goes {alert.condition} ₹{alert.target_price:,.0f}/quintal.",
        "alert",
        "Just now",
        0
    ))

    conn.commit()
    conn.close()

    new_alert = {
        "id": alert_id,
        "crop": alert.crop.lower(),
        "market": alert.market,
        "target_price": alert.target_price,
        "condition": alert.condition,
        "created_at": "Today, 10:00 AM",
        "active": True
    }

    return {"status": "success", "message": "Target price alert created successfully", "alert": new_alert}
