import os

class Settings:
    PROJECT_NAME: str = "AgriPrice AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    SQLITE_DB_PATH: str = os.getenv("SQLITE_DB_PATH", os.path.join(os.path.dirname(__file__), "..", "agriprice.db"))
    
    JWT_SECRET: str = os.getenv("JWT_SECRET", "agriprice_super_secret_jwt_key_2026_ap_hackathon")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    WEATHER_API_KEY: str = os.getenv("WEATHER_API_KEY", "demo_weather_key")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", os.getenv("GOOGLE_API_KEY", ""))

settings = Settings()

