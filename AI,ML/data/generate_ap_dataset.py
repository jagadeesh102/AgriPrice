import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def generate_ap_market_dataset():
    np.random.seed(42)
    start_date = datetime(2023, 1, 1)
    end_date = datetime(2026, 8, 1)
    num_days = (end_date - start_date).days

    crops = ['chilli', 'turmeric']
    markets = ['Guntur', 'Duggirala', 'Vijayawada', 'Kurnool', 'Kadapa', 'Anantapur']

    base_prices = {
        'chilli': {'Guntur': 18500, 'Duggirala': 19100, 'Vijayawada': 18200, 'Kurnool': 17900, 'Kadapa': 17600, 'Anantapur': 17400},
        'turmeric': {'Guntur': 12400, 'Duggirala': 12200, 'Vijayawada': 12000, 'Kurnool': 12600, 'Kadapa': 11800, 'Anantapur': 11500}
    }

    records = []

    for crop in crops:
        for market in markets:
            curr_price = base_prices[crop][market]
            
            for d in range(num_days):
                curr_date = start_date + timedelta(days=d)
                day_of_year = curr_date.timetuple().tm_yday
                month = curr_date.month

                # Seasonality: Chilli harvest is Feb-April, Turmeric is Jan-March
                if crop == 'chilli':
                    seasonal_factor = 1.0 - 0.08 * np.sin(2 * np.pi * (day_of_year - 60) / 365)
                else:
                    seasonal_factor = 1.0 - 0.06 * np.cos(2 * np.pi * (day_of_year - 30) / 365)

                # Weather simulation for AP
                temp = 24 + 12 * np.sin(2 * np.pi * (day_of_year - 100) / 365) + np.random.normal(0, 1.5)
                rainfall = max(0, np.random.exponential(5) if month in [6, 7, 8, 9, 10] else np.random.exponential(0.5))
                humidity = min(95, max(40, 65 + 15 * np.sin(2 * np.pi * (day_of_year - 150) / 365) + np.random.normal(0, 5)))

                # Market arrivals (inverse relation to price)
                arrivals = max(100, int(1500 * (2.0 - seasonal_factor) + np.random.normal(0, 200)))

                # Demand factors
                festival_period = 1 if month in [9, 10, 11, 1] else 0
                export_demand = np.random.choice([0.8, 1.0, 1.25], p=[0.2, 0.6, 0.2])
                demand_index = min(100, max(20, int(50 + 20 * festival_period + 10 * export_demand + np.random.normal(0, 5))))

                # Price walk with noise and trend
                random_walk = np.random.normal(0, 120)
                arrival_impact = -0.05 * (arrivals - 1500)
                weather_impact = 10 * (rainfall > 25) # Heavy rain disrupts supply, pushes price up

                curr_price = max(8000 if crop == 'turmeric' else 12000, 
                                 curr_price * 0.99 + (base_prices[crop][market] * seasonal_factor * export_demand) * 0.01 + arrival_impact * 0.1 + random_walk)

                records.append({
                    'date': curr_date.strftime('%Y-%m-%d'),
                    'crop': crop,
                    'market': market,
                    'price': round(curr_price, 2),
                    'arrivals': arrivals,
                    'rainfall': round(rainfall, 1),
                    'temperature': round(temp, 1),
                    'humidity': round(humidity, 1),
                    'demand_index': demand_index,
                    'festival_period': festival_period,
                    'export_demand': export_demand,
                    'month': month,
                    'day_of_year': day_of_year
                })

    df = pd.DataFrame(records)

    # Sort & generate lag features
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values(['crop', 'market', 'date']).reset_index(drop=True)

    df['price_lag_1'] = df.groupby(['crop', 'market'])['price'].shift(1)
    df['price_lag_7'] = df.groupby(['crop', 'market'])['price'].shift(7)
    df['price_lag_14'] = df.groupby(['crop', 'market'])['price'].shift(14)
    df['rolling_avg_7'] = df.groupby(['crop', 'market'])['price'].shift(1).rolling(7).mean()
    df['rolling_avg_30'] = df.groupby(['crop', 'market'])['price'].shift(1).rolling(30).mean()

    # Drop early NaNs from lag features
    df = df.dropna().reset_index(drop=True)

    os.makedirs('ml/data', exist_ok=True)
    csv_path = 'ml/data/ap_market_prices.csv'
    df.to_csv(csv_path, index=False)
    print(f"Generated {len(df)} AP market dataset records saved to {csv_path}")
    return csv_path

if __name__ == '__main__':
    generate_ap_market_dataset()
