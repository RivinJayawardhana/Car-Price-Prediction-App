from flask import Flask, request, jsonify
import pandas as pd
import joblib
from flask_cors import CORS
app = Flask(__name__)
CORS(app)


# Load your trained pipeline (make sure to save it after training)
model = joblib.load("best_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json  # Expect JSON with keys: Model, Mfg_Year, KM, CC, Fuel_Type
    
    # Validate input keys
    required_keys = ['Model', 'Mfg_Year', 'KM', 'CC', 'Fuel_Type']
    if not all(k in data for k in required_keys):
        return jsonify({"error": "Missing fields in input"}), 400

    # Create DataFrame for model
    input_df = pd.DataFrame({k: [data[k]] for k in required_keys})

    # Predict
    pred_price = model.predict(input_df)[0]

    return jsonify({"predicted_price": pred_price})

if __name__ == "__main__":
    app.run(debug=True)
