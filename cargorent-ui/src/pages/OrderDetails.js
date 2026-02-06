import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load order details");
    }
  };

  if (!order) {
    return <p style={{ textAlign: "center" }}>Loading order...</p>;
  }

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h2>Order #{order.orderId}</h2>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>

      <h3>Cars</h3>

      {order.items && order.items.length === 0 && (
        <p>No cars found for this order.</p>
      )}

      {order.items && order.items.map((item, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "10px",
          }}
        >
          <p><strong>Car:</strong> {item.carName}</p>
          <p><strong>Days:</strong> {item.numberOfDays}</p>
          <p><strong>Price:</strong> ₹{item.price}</p>
        </div>
      ))}
    </div>
  );
}

export default OrderDetails;