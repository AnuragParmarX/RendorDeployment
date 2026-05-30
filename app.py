import os
import json
import numpy as np
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from PIL import Image
import tensorflow as tf
import gdown 

app = Flask(__name__)
# Enable CORS so the local frontend can communicate with the backend
CORS(app)

# Load the trained model
MODEL_PATH = "trained_model.keras"
FILE_ID = "1GDQ-oZjPkOP3v0V7GIiff75-N28AeZZj"

if not os.path.exists(MODEL_PATH):
    url = f"https://drive.google.com/uc?id={FILE_ID}"
    gdown.download(url, MODEL_PATH, quiet=False)

model = tf.keras.models.load_model(MODEL_PATH)

# Assume 256x256 as common size, change to 224x224 if your model expects that
TARGET_SIZE = (128, 128)

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Update this list to match the exact exact classes your model was trained on.
# Following the treatment suggestions found in script.js as a base reference.
CLASS_NAMES = ['Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy', 'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy', 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy', 'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy', 'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy']

def preprocess_image(image, target_size):
    """
    Preprocess the image to be compatible with the model.
    """
    if image.mode != "RGB":
        image = image.convert("RGB")
    
    image = image.resize(target_size)
    img_array = tf.keras.preprocessing.image.img_to_array(image)
    img_array = np.expand_dims(img_array, axis=0) # Create a batch
    
    # Optional: Scale to [0, 1] if your model requires it.
    img_array = img_array / 255.0
    
    return img_array

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model object not loaded."}), 500

    if "image" not in request.files:
        return jsonify({"error": "No image provided."}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No selected file."}), 400

    try:
        # Read the image file
        image = Image.open(file)
        
        # Preprocess the image
        processed_image = preprocess_image(image, target_size=TARGET_SIZE)
        
        # Perform prediction
        predictions = model.predict(processed_image)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0])) * 100
        
        # Map the prediction to the class name
        if predicted_class_idx < len(CLASS_NAMES):
            disease_name = CLASS_NAMES[predicted_class_idx]
        else:
            disease_name = f"Class Index {predicted_class_idx}"

        results = {
            "prediction": disease_name,
            "confidence": confidence
        }
        
        return jsonify(results)

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
