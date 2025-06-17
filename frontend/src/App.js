import React, { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    Model: "",
    Mfg_Year: "",
    KM: "",
    CC: "",
    Fuel_Type: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setResult(data.predicted_price);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Car Price Predictor</h2>
      <form onSubmit={handleSubmit}>
        <label>Model:</label>
        <input name="Model" value={formData.Model} onChange={handleChange} required />

        <label>Manufacture Year:</label>
        <input type="number" name="Mfg_Year" value={formData.Mfg_Year} onChange={handleChange} required />

        <label>Mileage (KM):</label>
        <input type="number" name="KM" value={formData.KM} onChange={handleChange} required />

        <label>Engine Capacity (CC):</label>
        <input type="number" name="CC" value={formData.CC} onChange={handleChange} required />

        <label>Fuel Type:</label>
        <input name="Fuel_Type" value={formData.Fuel_Type} onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict Price"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && <p>Estimated Price: ${result.toFixed(2)}</p>}
    </div>
  );
}

export default App;
