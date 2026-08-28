from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ai_service_token: str = "dev-token"
    gemini_api_key: str = ""
    r2_account_id: str = ""
    r2_access_key_id: str = ""
    r2_secret_access_key: str = ""
    r2_bucket_name: str = "alms-assets"
    r2_endpoint: str = ""
    database_url: str = "postgresql://postgres:password@localhost:5432/postgres"
    redis_url: str = "redis://localhost:6379"
    backend_url: str = "http://localhost:3001"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
