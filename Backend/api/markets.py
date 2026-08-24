from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from Backend.database.sqlite_db import get_db_connection

router = APIRouter(prefix="/markets", tags=["Markets"])

@router.get("", response_model=List[Dict[str, Any]])
def get_all_markets():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM markets")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/summary")
def get_markets_summary():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM markets")
    rows = cursor.fetchall()
    conn.close()

    markets = [dict(r) for r in rows]
    if not markets:
        raise HTTPException(status_code=444, detail="No markets configured")

    best_chilli_current = max(markets, key=lambda x: x["chilli_price"])
    best_turmeric_current = max(markets, key=lambda x: x["turmeric_price"])

    best_chilli_forecast = {**best_chilli_current, "forecasted_price": round(best_chilli_current["chilli_price"] * 1.084, 2)}
    best_turmeric_forecast = {**best_turmeric_current, "forecasted_price": round(best_turmeric_current["turmeric_price"] * 1.062, 2)}

    return {
        "markets": markets,
        "best_current_price": {
            "chilli": {"market": best_chilli_current["name"], "price": best_chilli_current["chilli_price"]},
            "turmeric": {"market": best_turmeric_current["name"], "price": best_turmeric_current["turmeric_price"]}
        },
        "best_forecasted_price": {
            "chilli": {"market": best_chilli_forecast["name"], "price": best_chilli_forecast["forecasted_price"]},
            "turmeric": {"market": best_turmeric_forecast["name"], "price": best_turmeric_forecast["forecasted_price"]}
        }
    }

@router.get("/{market_id}")
def get_market_by_id(market_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM markets WHERE LOWER(id) = ?", (market_id.lower(),))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Market not found")
    return dict(row)
