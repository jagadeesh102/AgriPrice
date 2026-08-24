import pandas as pd
import numpy as np
import pickle
import json
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import sys

# Add root directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml.generate_ap_dataset import generate_ap_market_dataset

def train_agriprice_model(data_path=None):
    if data_path is None or not os.path.exists(data_path):
        data_path = generate_ap_market_dataset()

    print(f"Loading dataset from {data_path}...")
    df = pd.read_csv(data_path)
    df['date'] = pd.to_datetime(df['date'])

    # Feature engineering for multi-day target forecasting
    features = [
        'crop', 'market', 'arrivals', 'rainfall', 'temperature', 
        'humidity', 'demand_index', 'festival_period', 'export_demand',
        'month', 'day_of_year', 'price_lag_1', 'price_lag_7', 'rolling_avg_7'
    ]
    target = 'price'

    X = df[features]
    y = df[target]

    # Time-based split (80% train, 20% test)
    split_idx = int(len(df) * 0.8)
    X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

    categorical_cols = ['crop', 'market']
    numeric_cols = [col for col in features if col not in categorical_cols]

    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_cols)
        ],
        remainder='passthrough'
    )

    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1))
    ])

    print("Training Random Forest Regressor on AP Agricultural dataset...")
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100
    r2 = r2_score(y_test, y_pred)

    metrics = {
        'mae': round(float(mae), 2),
        'rmse': round(float(rmse), 2),
        'mape': round(float(mape), 2),
        'r2': round(float(r2), 4),
        'train_samples': len(X_train),
        'test_samples': len(X_test),
        'last_trained': pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')
    }

    print("--- Model Evaluation Metrics ---")
    print(f"MAE  : INR {metrics['mae']}")
    print(f"RMSE : INR {metrics['rmse']}")
    print(f"MAPE : {metrics['mape']}%")
    print(f"R2   : {metrics['r2']}")

    # Ensure output directories exist
    os.makedirs('backend/app/ml', exist_ok=True)
    
    # Save pipeline model & metrics
    model_path = 'backend/app/ml/model.pkl'
    metrics_path = 'backend/app/ml/metrics.json'

    with open(model_path, 'wb') as f:
        pickle.dump(model, f)

    with open(metrics_path, 'w') as f:
        json.dump(metrics, f, indent=2)

    print(f"Model saved to {model_path}")
    print(f"Metrics saved to {metrics_path}")

    return model, metrics

if __name__ == '__main__':
    train_agriprice_model()
