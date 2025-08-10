#!bin\bash

echo "Building Docker image..."
docker build -t test . 

echo "Running Docker container..."
docker run -dt -p 8000:8000 test