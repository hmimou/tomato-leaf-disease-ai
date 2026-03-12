from flask import Flask, request, jsonify, render_template
from agent.agent import ask
from agent.model_utils import load_model, predict
import os

app = Flask(__name__)
MODEL_PATH = "models/model.pth"
DEVICE = "cpu"
model = load_model(MODEL_PATH, DEVICE)
status = ""

@app.route("/predict", methods=["POST"])
def predict_route():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files["image"]
    image_path = f"temp_{image_file.filename}"
    image_file.save(image_path)

    try:
        disease, confidence = predict(model, image_path, DEVICE)
        if confidence > 0.8:
            status = "success"
        elif confidence > 0.5:
            status = "uncertain"
        else:
            status = "failure"
    finally:
        os.remove(image_path)  # clean up temp file

    return jsonify({
    "prediction": disease,
    "confidence": round(confidence * 100, 2),
    "status": status
})

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/treatment", methods=["POST"])
def treatment():

    data = request.get_json()

    disease = data.get("disease")

    if not disease:
        return jsonify({"error": "No disease provided"}), 400

    prompt =   f"""
            You are an expert tomato farmer and agronomist.
            The tomato disease is "{disease}".
            Give a **short, practical treatment plan** for farmers to save their crops.
            Use **simple instructions**.
            Maximum 5 sentences or a small bulleted list.
            """
    answer = ask(prompt)

    return jsonify({"treatment": answer})


if __name__ == "__main__":
    app.run(debug=True)