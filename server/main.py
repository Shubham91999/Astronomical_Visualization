from fastapi import FastAPI, HTTPException, UploadFile, File, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from astropy.io import fits
import os
import json
import matplotlib.pyplot as plt
import io

app = FastAPI(title="Astronomical Visualization API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Data
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
CSV_PATH = os.path.join(DATA_DIR, "cleaned_star_data.csv")

try:
    # Read CSV, handle potential column name issues (strip spaces)
    df = pd.read_csv(CSV_PATH)
    df.columns = df.columns.str.strip()
    # Ensure numeric columns are actually numeric
    numeric_cols = ['Temperature (K)', 'Luminosity(L/Lo)', 'Radius(R/Ro)', 'Absolute magnitude(Mv)']
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    
    print("Data loaded successfully.")
except Exception as e:
    print(f"Error loading data: {e}")
    df = pd.DataFrame()

# Models
class StarSearch(BaseModel):
    min_temp: float = None
    max_temp: float = None
    star_type: int = None
    color: str = None

@app.get("/api")
def read_root():
    return {"status": "ok", "message": "Space Dashboard API is active"}

@app.get("/stars")
def get_stars(limit: int = 100, search: str = None):
    """
    Get list of stars with optional text search on Star color or Spectral Class.
    """
    if df.empty:
        return []
    
    result = df.copy()
    
    # Simple search implementation
    if search:
        search = search.lower()
        # Filter by color or spectral class
        mask = (
            result['Star color'].str.lower().str.contains(search, na=False) |
            result['Spectral Class'].str.lower().str.contains(search, na=False)
        )
        result = result[mask]
    
    # Replace NaN with None for JSON compatibility
    result = result.replace({np.nan: None})
    
    return result.head(limit).to_dict(orient="records")

@app.get("/star-types")
def get_star_types():
    if df.empty:
        return []
    return list(df['Star type'].unique())

@app.get("/habitability/{star_index}")
def check_habitability(star_index: int):
    """
    Calculate simple Goldilocks zone based on Luminosity.
    Formula approach:
    Ri = sqrt(L_star / 1.1)
    Ro = sqrt(L_star / 0.53)
    (Distances in AU)
    """
    if df.empty or star_index >= len(df):
        raise HTTPException(status_code=404, detail="Star not found")
    
    star = df.iloc[star_index]
    luminosity = star['Luminosity(L/Lo)']
    
    # Handle missing or invalid luminosity
    if luminosity is None or luminosity <= 0:
        return {"habitable": False, "reason": "Invalid or missing luminosity data"}

    # Estimate habitable zone boundaries in AU
    inner_boundary = np.sqrt(luminosity / 1.1)
    outer_boundary = np.sqrt(luminosity / 0.53)
    
    return {
        "star_name": f"Star {star_index}",
        "luminosity": luminosity,
        "habitable_zone_inner_au": round(inner_boundary, 4),
        "habitable_zone_outer_au": round(outer_boundary, 4),
        "details": star.replace({np.nan: None}).to_dict()
    }

@app.post("/fits/upload")
async def process_fits(file: UploadFile = File(...), colormap: str = "magma"):
    """
    Process a FITS file and return header info + base64 image preview.
    """
    temp_path = os.path.join(DATA_DIR, f"temp_{file.filename}")
    try:
        contents = await file.read()
        with open(temp_path, "wb") as f:
            f.write(contents)
            
        hdul = fits.open(temp_path)
        header_info = dict(hdul[0].header)
        image_data = hdul[0].data
        
        if image_data is None and len(hdul) > 1:
             image_data = hdul[1].data
             header_info = dict(hdul[1].header)

        image_url = None
        if image_data is not None:
             import base64
             from io import BytesIO
             import matplotlib.pyplot as plt

             # Robust normalization for astronomical images
             data_safe = np.nan_to_num(image_data)
             
             # Clip outliers (99th percentile) to improve contrast
             vmin, vmax = np.percentile(data_safe, [0.5, 99.5])
             data_clipped = np.clip(data_safe, vmin, vmax)
             
             # Apply log scale for dynamic range
             # Shifting to positive range if necessary
             data_shifted = data_clipped - np.min(data_clipped)
             data_log = np.log1p(data_shifted)

             plt.figure(figsize=(6, 6), facecolor='#0B0B15')
             plt.imshow(data_log, cmap=colormap, origin='lower')
             plt.axis('off')
             
             buf = BytesIO()
             plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0, transparent=True)
             plt.close()
             buf.seek(0)
             image_base64 = base64.b64encode(buf.read()).decode('utf-8')
             image_url = f"data:image/png;base64,{image_base64}"


        info = {
            "filename": file.filename,
            "shape": list(image_data.shape) if image_data is not None else "No Image Data",
            "header_summary": {k: str(v) for k, v in list(header_info.items())[:10]}, # First 10 items
            "image_url": image_url

        }
        
        hdul.close()
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return info
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=f"FITS Processing Error: {str(e)}")

# Mount data directory for direct access if needed
app.mount("/data", StaticFiles(directory=DATA_DIR), name="data")

# Serve Frontend
DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "client", "dist")

if os.path.exists(DIST_DIR):
    app.mount("/", StaticFiles(directory=DIST_DIR, html=True), name="frontend")
    
    @app.exception_handler(404)
    async def not_found_exception_handler(request: Request, exc: HTTPException):
        # Fallback to index.html for SPA routing
        if not request.url.path.startswith("/stars") and \
           not request.url.path.startswith("/habitability") and \
           not request.url.path.startswith("/fits") and \
           not request.url.path.startswith("/data"):
            return FileResponse(os.path.join(DIST_DIR, "index.html"))
        return exc

if __name__ == "__main__":
    import uvicorn
    # Use port from environment for deployment
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
