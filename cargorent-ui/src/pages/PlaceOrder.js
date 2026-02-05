import { useLocation } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function PlaceOrder() {
  const location = useLocation();
  const { carId, companyId, pricePerDay } = location.state;

  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(false);

  const customerId = 1; // TEMP: hardcoded (JWT will replace this)

  const totalAmount = pricePerDay * days;

  const placeOrder = async () => {
    setLoading(true);

    const orderPayload = {
      customerId,
      companyId,
      items: [
        {
          carId,
          numberOfDays: days,
        },
      ],
    };

    try {
      await api.post("/orders", orderPayload);
      alert("Order placed successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>Confirm Your Booking</h2>

      <p><strong>Price per day:</strong> ₹{pricePerDay}</p>

      <label>
        Number of days:
        <input
          type="number"
          min="1"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          style={{ marginLeft: "10px" }}
        />
      </label>

      <p><strong>Total Amount:</strong> ₹{totalAmount}</p>

      <button onClick={placeOrder} disabled={loading}>
        {loading ? "Placing Order..." : "Confirm Order"}
      </button>
    </div>
  );
}

export default PlaceOrder;