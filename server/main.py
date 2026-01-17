from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import data_routes, generate_routes, gallery_routes
import uvicorn
import os

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(data_routes.router, prefix="/api")
app.include_router(generate_routes.router, prefix="/api")
app.include_router(gallery_routes.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Room Scene Visualizer API is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
