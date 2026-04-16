# This tells Railway to build the Backend
FROM python:3.10-slim

WORKDIR /app

# Install dependencies - Removed "backend/" prefix
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the code - Removed "backend/" prefix
COPY . .

# Start the server
CMD ["gunicorn", "task_manager.wsgi", "--bind", "0.0.0.0:$PORT"]