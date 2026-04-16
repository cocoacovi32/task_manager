# This tells Railway to build the Backend
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the code
COPY backend/ .

# Start the server
CMD ["gunicorn", "task_manager.wsgi", "--bind", "0.0.0.0:\"]
