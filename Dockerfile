FROM python:3.10-slim

WORKDIR /code

# Install core image-processing system packages
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Cache and install python dependencies
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy all application files
COPY . .

# Expose the mandatory Hugging Face port container
EXPOSE 7860

# Run Flask, forcing it to listen on the container port
CMD ["python", "app.py"]
