from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="DealFlow360 API",
    description="Intelligent Sales Operations Platform",
    version="1.0.0",
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "DealFlow360 API is running"}

# TODO: Include routers here once they are created
# app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
