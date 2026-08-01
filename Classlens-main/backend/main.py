from fastapi import FastAPI
from database import engine, Base
import models
from routers import enrollment, attendance, admin

# Create all DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Face Attendance System API")

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(enrollment.router, prefix="/api/v1")
app.include_router(attendance.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to Face Attendance System API"}
