import os
import json
import numpy as np
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from PIL import Image
import tensorflow as tf
import gc  # Force background memory release

app = Flask(__name__)
CORS(app)

# Point directly to the model file you uploaded to GitHub
MODEL_PATH = "trained_model.keras"

# Clean up memory completely before loading the model
gc.collect()
tf.keras.backend.clear_session()

# Configure TensorFlow to use minimal background threads to prevent RAM spikes
tf.config.threading.set_inter_op_parallelism_threads(1)
tf.config.threading.set_intra_op_parallelism_threads(1)

# Load the model ONCE globally at startup within memory constraints
model = None
try:
    if os.path.exists(MODEL_PATH):
        print("Attempting to load model within memory limits...")
        model = tf.keras.models.load_model(MODEL_PATH)
        print("Model loaded successfully from local repository.")
    else:
        print(f"Critical Error: {MODEL_PATH} not found in repository.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Free memory right after loading phase completes
gc.collect()

# Update to 224x224 or 256x256 if your model expects a different size
TARGET_SIZE = (128, 128)

CLASS_NAMES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy', 
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy', 
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_', 
    'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 'Grape___Black_rot', 
    'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy', 
    'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy', 
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight', 
    'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy', 
    'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy', 
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 
    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite', 
    'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 
    'Tomato___healthy'
]

def preprocess_image(image, target_size):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    img_array = tf.keras.preprocessing.image.img_to_array(image)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0  # Normalize pixel values
    return img_array

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model object not loaded on server."}), 500

    if "image" not in request.files:
        return jsonify({"error": "No image provided."}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No selected file."}), 400

    try:
        image = Image.open(file)
        processed_image = preprocess_image(image, target_size=TARGET_SIZE)
        
        # Run prediction
        predictions = model.predict(processed_image)
        predicted_class_idx = np.argmax(predictions)
        confidence = float(np.max(predictions)) * 100
        
        # Clear backend session and run garbage collector immediately to free up RAM
        tf.keras.backend.clear_session()
        gc.collect()
        
        if predicted_class_idx < len(CLASS_NAMES):
            disease_name = CLASS_NAMES[predicted_class_idx]
        else:
            disease_name = f"Class Index {predicted_class_idx}"

        return jsonify({
            "prediction": disease_name,
            "confidence": confidence
        })

    except Exception as e:
        print(f"Prediction error: {e}")
        # Make sure session clears even if it fails
        tf.keras.backend.clear_session()
        gc.collect()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
