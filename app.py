import os
import json
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import tensorflow as tf
import gdown
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)

# =========================
# CONFIG
# =========================

MODEL_PATH = "trained_model.keras"

# IMPORTANT: change this to your real Google Drive file ID
GDRIVE_FILE_ID = "1GDQ-oZjPkOP3v0V7GIiff75-N28AeZZj"

# Change this if your model expects 224x224
TARGET_SIZE = (128, 128)

CLASS_NAMES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust',
    'Apple___healthy', 'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy',
    'Grape___Black_rot', 'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy',
    'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
    'Raspberry___healthy', 'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight',
    'Tomato___Late_blight', 'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]

model = None


# =========================
# DOWNLOAD MODEL (DRIVE)
# =========================

def download_model():
    global MODEL_PATH

    if not os.path.exists(MODEL_PATH):
        print("Model not found locally. Downloading from Google Drive...")

        url = f"https://drive.google.com/uc?id={GDRIVE_FILE_ID}"

        try:
            gdown.download(url, MODEL_PATH, quiet=False)
            print("Model downloaded successfully.")
        except Exception as e:
            print(f"Model download failed: {e}")


# =========================
# LOAD MODEL
# =========================

def load_ml_model():
    global model

    try:
        model = tf.keras.models.load_model(MODEL_PATH)
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None


# Run at startup
download_model()
load_ml_model()


# =========================
# IMAGE PREPROCESSING
# =========================

def preprocess_image(image, target_size):
    if image.mode != "RGB":
        image = image.convert("RGB")

    image = image.resize(target_size)

    img_array = tf.keras.preprocessing.image.img_to_array(image)
    img_array = np.expand_dims(img_array, axis=0)

    img_array = img_array / 255.0

    return img_array


# =========================
# ROUTES
# =========================

@app.route("/")
def home():
    return jsonify({"message": "Flask API is running"})


@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "Empty file"}), 400

    try:
        image = Image.open(file)

        processed_image = preprocess_image(image, TARGET_SIZE)

        predictions = model.predict(processed_image)

        predicted_class_idx = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0])) * 100

        if predicted_class_idx < len(CLASS_NAMES):
            disease_name = CLASS_NAMES[predicted_class_idx]
        else:
            disease_name = f"Unknown Class {predicted_class_idx}"

        return jsonify({
            "prediction": disease_name,
            "confidence": confidence
        })

    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": str(e)}), 500


# =========================
# MAIN
# =========================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
