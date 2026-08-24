from fastapi import APIRouter, Query
from typing import List, Dict, Any, Optional
from Backend.database.sqlite_db import get_db_connection

router = APIRouter(prefix="/prices", tags=["Prices"])

@router.get("/current")
def get_current_price(
    crop: str = Query("chilli", description="chilli or turmeric"),
    market: str = Query("Guntur", description="Market name")
):
    crop_clean = crop.lower()
    market_clean = market.split()[0].title()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM markets WHERE name LIKE ?", (f"{market_clean}%",))
    m_row = cursor.fetchone()

    if not m_row:
        cursor.execute("SELECT * FROM markets LIMIT 1")
        m_row = cursor.fetchone()

    m_dict = dict(m_row)
    conn.close()

    price = m_dict["chilli_price"] if crop_clean == "chilli" else m_dict["turmeric_price"]

    return {
        "crop": crop_clean,
        "market": market_clean,
        "current_price": price,
        "unit": "per Quintal (100 kg)",
        "currency": "INR",
        "last_updated": "Today, 09:30 AM",
        "data_type": "LIVE_SPOT_DEMO"
    }

@router.get("")
def get_historical_prices(
    crop: str = Query("chilli"),
    market: Optional[str] = Query(None),
    days: int = Query(30)
):
    crop_clean = crop.lower()
    conn = get_db_connection()
    cursor = conn.cursor()

    if market:
        market_clean = market.split()[0].title()
        cursor.execute('''
            SELECT date, crop, market, price, arrivals_quintals, source
            FROM prices
            WHERE crop = ? AND market LIKE ?
            ORDER BY id DESC LIMIT ?
        ''', (crop_clean, f"{market_clean}%", days))
    else:
        cursor.execute('''
            SELECT date, crop, market, price, arrivals_quintals, source
            FROM prices
            WHERE crop = ?
            ORDER BY id DESC LIMIT ?
        ''', (crop_clean, days))

    rows = cursor.fetchall()
    conn.close()

    filtered = [dict(r) for r in reversed(rows)]

    if filtered:
        prices_list = [p["price"] for p in filtered]
        stats = {
            "highest_price": max(prices_list),
            "lowest_price": min(prices_list),
            "average_price": round(sum(prices_list) / len(prices_list), 2),
            "volatility": "Low to Moderate" if (max(prices_list) - min(prices_list)) < 1500 else "High"
        }
    else:
        stats = {"highest_price": 0, "lowest_price": 0, "average_price": 0, "volatility": "N/A"}

    return {
        "crop": crop_clean,
        "market": market or "All Markets",
        "record_count": len(filtered),
        "statistics": stats,
        "records": filtered
    }
