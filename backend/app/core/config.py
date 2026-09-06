from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./dealflow360.db"
    SECRET_KEY: str = "insecure_dev_secret_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Blended Risk Thresholds
    RISK_MANAGER_THRESHOLD: float = 25.0
    RISK_FINANCE_THRESHOLD: float = 50.0
    WORST_LINE_OVERAGE_ESCALATE: float = 15.0  # percentage points

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
