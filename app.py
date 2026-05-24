import os
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import tensorflow as tf
import gdown
import time

app = Flask(__name__)
CORS(app)

# =========================
# CONFIG (FIXED PATH ISSUE)
# =========================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "trained_model.keras")

GDRIVE_FILE_ID = "1GDQ-oZjPkOP3v0V7GIiff75-N28AeZZj"
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
# DOWNLOAD MODEL (FIXED)
# =========================

def download_model():
    if os.path.exists(MODEL_PATH):
        print("✅ Model already exists at:", MODEL_PATH)
        return True

    print("⬇ Downloading model...")

    url = f"https://drive.google.com/uc?id={GDRIVE_FILE_ID}"

    try:
        gdown.download(url, MODEL_PATH, quiet=False)

        # validation
        if not os.path.exists(MODEL_PATH):
            print("❌ File not created")
            return False

        size = os.path.getsize(MODEL_PATH)
        print("📦 Model size:", size)

        if size < 10_000_000:
            print("❌ File corrupted or incomplete")
            return False

        print("✅ Model download OK")
        return True

    except Exception as e:
        print("❌ Download error:", e)
        return False


# =========================
# LOAD MODEL (FIXED)
# =========================

def load_model_safe():
    global model

    if model is not None:
        return True

    if not os.path.exists(MODEL_PATH):
        print("❌ Model missing at:", MODEL_PATH)
        return False

    try:
        print("📦 Loading TensorFlow model...")
        time.sleep(3)

        model = tf.keras.models.load_model(MODEL_PATH)

        print("✅ Model loaded successfully")
        return True

    except Exception as e:
        print("❌ Model loading error:", e)
        return False


# =========================
# STARTUP (RUN ONCE ONLY)
# =========================

print("🚀 Server starting...")

if download_model():
    load_model_safe()
else:
    print("❌ Model download failed at startup")


# =========================
# IMAGE PREPROCESS
# =========================

def preprocess_image(image):
    if image.mode != "RGB":
        image = image.convert("RGB")

    image = image.resize(TARGET_SIZE)

    img = tf.keras.preprocessing.image.img_to_array(image)
    img = np.expand_dims(img, axis=0)

    return img / 255.0


# =========================
# ROUTES
# =========================

@app.route("/")
def home():
    return jsonify({
        "status": "API running",
        "model_loaded": model is not None
    })


@app.route("/predict", methods=["POST"])
def predict():
    global model

    if model is None:
        load_model_safe()

    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    try:
        image = Image.open(request.files["image"])
        processed = preprocess_image(image)

        preds = model.predict(processed)

        idx = int(np.argmax(preds[0]))
        confidence = float(np.max(preds[0])) * 100

        disease = CLASS_NAMES[idx] if idx < len(CLASS_NAMES) else "Unknown"

        return jsonify({
            "prediction": disease,
            "confidence": confidence
        })

    except Exception as e:
        print("❌ Prediction error:", e)
        return jsonify({"error": str(e)}), 500


# =========================
# RUN
# =========================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
