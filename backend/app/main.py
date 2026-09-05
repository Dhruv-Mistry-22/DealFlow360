from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, catalog, quotes, risk, fulfillment, billing, portal, dashboard

app = FastAPI(
    title="DealFlow360 API",
    description="Intelligent Sales Operations Platform",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route registration
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(catalog.router, prefix="/api/v1", tags=["Catalog"])
app.include_router(quotes.router, prefix="/api/v1", tags=["Quotes & Approvals"])
app.include_router(risk.router, prefix="/api/v1", tags=["Risk"])
app.include_router(fulfillment.router, prefix="/api/v1", tags=["Fulfillment"])
app.include_router(billing.router, prefix="/api/v1", tags=["Billing"])
app.include_router(portal.router, prefix="/api/v1", tags=["Customer Portal"])
app.include_router(dashboard.router, prefix="/api/v1", tags=["Dashboard"])


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "DealFlow360 API is running", "version": "2.0.0"}
