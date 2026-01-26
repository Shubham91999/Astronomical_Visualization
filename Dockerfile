# Stage 1: Build the React frontend
FROM node:22-alpine AS build-stage
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Serve the backend and the frontend
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies for astropy/matplotlib if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY server/requirements.txt ./server/
RUN pip install --no-cache-dir -r server/requirements.txt
# we also need matplotlib which was added later
RUN pip install matplotlib

# Copy backend code
COPY server/ ./server/

# Copy data
COPY data/ ./data/

# Copy built frontend from build-stage
COPY --from=build-stage /app/client/dist ./client/dist

# Expose port
EXPOSE 8000
ENV PORT=8000

# Run the application
CMD ["python", "server/main.py"]
