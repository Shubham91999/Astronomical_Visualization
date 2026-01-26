from astropy.io import fits
import os
import numpy as np

file_path = "data/HorseHead.fits"

try:
    hdul = fits.open(file_path)
    print("FITS opened successfully.")
    
    # Check HDUs
    print(f"Number of HDUs: {len(hdul)}")
    for i, hdu in enumerate(hdul):
        print(f"HDU {i}: {type(hdu)}")
        print(f"  Data shape: {hdu.data.shape if hdu.data is not None else 'None'}")
        
    # Simulate the backend logic
    header_info = dict(hdul[0].header)
    image_data = hdul[0].data
    
    if image_data is None and len(hdul) > 1:
        print("Switching to HDU 1")
        image_data = hdul[1].data
        header_info = dict(hdul[1].header)

    # Simulate JSON serialization prep
    info = {
        "filename": "HorseHead.fits",
        "shape": list(image_data.shape) if image_data is not None else "No Image Data",
        "header_summary": {str(k): str(v) for k, v in list(header_info.items())[:10]} 
    }
    
    print("Processed Info:")
    print(info)
    
    hdul.close()

except Exception as e:
    print(f"Error processing FITS: {e}")
    import traceback
    traceback.print_exc()
