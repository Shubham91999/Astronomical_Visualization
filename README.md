# 🌌 Astronomical Visualization

> **Tagline:** Python-based astronomical image visualization and analysis using FITS files, NumPy, and Matplotlib.

**GitHub About Section (suggestion):**
> Explore, process, and visualize astronomical data using Python and Jupyter. Includes FITS image processing, pixel-level analysis, and data-driven star visualization.

---

## 🚀 Overview

This project focuses on **processing, analyzing, and visualizing astronomical data** — including FITS (Flexible Image Transport System) files and star catalogs — to create meaningful visual representations of celestial objects.  

Through a series of Jupyter notebooks, the project demonstrates how to:
- Load and explore astronomical image data.
- Perform image preprocessing and pixel-level transformations.
- Clean, filter, and analyze star datasets.
- Visualize star patterns, intensity maps, and image features.

This repository serves as a foundation for researchers, students, and enthusiasts interested in **scientific visualization, data cleaning, and space data analysis**.

---

## 🧠 Key Features

✅ **Data Cleaning and Preparation**
- Handles raw star catalog data.
- Cleans missing or noisy entries to create a usable dataset (`cleaned_star_data.csv`).

✅ **Image Processing**
- Works with astronomical `.FITS` image files (e.g., `Test_FITS_file.fits`).
- Reads, normalizes, and enhances celestial image data.
- Demonstrates per-pixel operations and visualization.

✅ **Visualization**
- Generates plots of star data and intensity maps.
- Builds visualizations using Matplotlib and Plotly.
- Explores patterns, brightness, and object distribution.

✅ **Exploratory Notebooks**
- Modular Jupyter notebooks for step-by-step experimentation:
  - `Basics.ipynb`: Foundational concepts and initial exploration.
  - `Image_Processing.ipynb`: Image enhancement and FITS file manipulation.
  - `Image_pixel.ipynb`: Pixel-level image analysis.
  - `Visualize.ipynb`: Final visualizations and plots.
  - `star_plots/`: Additional plots and utilities for star mapping.

---

## 🧩 Repository Structure

```
Astronomical_Visualization/
│
├── star_plots/                  # Visualization scripts and outputs
├── Basics.ipynb                 # Introductory exploration notebook
├── Image_Processing.ipynb       # FITS image preprocessing & enhancement
├── Image_pixel.ipynb            # Pixel-level data manipulations
├── Visualize.ipynb              # Final visualization and plotting
├── cleaned_star_data.csv        # Processed dataset of stars
├── Test_FITS_file.fits          # Sample astronomical image
├── Test7_FITS_file.fits         # Additional FITS sample
├── skv1001259399386.png         # Example output image
└── .vscode/                     # Editor configuration
```

---

## 🧰 Tech Stack

| Category | Tools Used |
|-----------|-------------|
| **Language** | Python |
| **Environment** | Jupyter Notebook |
| **Data Formats** | CSV, FITS |
| **Visualization Libraries** | Matplotlib, Plotly |
| **Image Processing** | NumPy, SciPy, Astropy |
| **Data Handling** | Pandas |

---

## 🪐 Sample Workflow

1. **Load astronomical FITS image**
   ```python
   from astropy.io import fits
   image = fits.getdata("Test_FITS_file.fits")
   ```

2. **Visualize the image**
   ```python
   import matplotlib.pyplot as plt
   plt.imshow(image, cmap="plasma")
   plt.title("Astronomical Image Visualization")
   plt.colorbar()
   plt.show()
   ```

3. **Analyze pixel intensity distribution**
   ```python
   import numpy as np
   plt.hist(image.ravel(), bins=256, color='cyan')
   plt.title("Pixel Intensity Distribution")
   plt.show()
   ```

---

## 📊 Example Outputs

| Visualization | Description |
|----------------|-------------|
| 🌠 **Star Map** | Plots the position and brightness of stars from the cleaned dataset. |
| 🌌 **Intensity Heatmap** | Displays energy distribution across astronomical images. |
| 🪞 **Pixel-Level Visualization** | Highlights brightness clusters and noise patterns in FITS data. |

*(See `Visualize.ipynb` for full examples.)*

---

## 🧭 Future Improvements

- [ ] Add machine learning–based star classification (using CNNs).  
- [ ] Integrate interactive 3D visualization using Plotly or Bokeh.  
- [ ] Wrap into a Flask/Dash app for live exploration.  
- [ ] Add detailed documentation and code comments.  
- [ ] Publish on Kaggle or HuggingFace Datasets.

---

## 💡 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Shubham91999/Astronomical_Visualization.git
   cd Astronomical_Visualization
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Launch Jupyter:
   ```bash
   jupyter notebook
   ```

4. Open and run any of the notebooks sequentially.

---

## 🧑‍🚀 Author

**Shubham Kulkarni**  
ML Software Engineer @ PACCAR | Arizona State University  
🌍 [LinkedIn](https://www.linkedin.com/in/shubham91999) • [GitHub](https://github.com/Shubham91999)

---

## 🪙 License

This project is released under the **MIT License** — feel free to use and modify it for learning or research.

---

⭐ *If you find this useful, consider giving the repository a star to support open-source science!* 🌟
