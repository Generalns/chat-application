# Use the official Python image as the base image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install any dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the entire project to the working directory
COPY . .

# Expose the port that FastAPI will run on
EXPOSE 8000

# Command to run the application
CMD uvicorn main:app --host 0.0.0.0 --port 8000