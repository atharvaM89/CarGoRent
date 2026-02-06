import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p style={{ padding: "24px" }}>Loading...</p>;
  }

  if (!order) {
    return <p style={{ padding: "24px" }}>Order not found.</p>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      <h2>Order Details</h2>

      <div style={{ border: "1px solid #ccc", padding: "16px", marginBottom: "16px" }}>
        <p><strong>Order ID:</strong> {order.orderId}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
        <p>
          <strong>Placed At:</strong>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <h3>Items</h3>

      {order.items.length === 0 && <p>No items found.</p>}

      {order.items.map((item, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #e5e7eb",
            padding: "12px",
            marginBottom: "10px",
          }}
        >
          <p><strong>Car:</strong> {item.carModel}</p>
          <p><strong>Days:</strong> {item.numberOfDays}</p>
          <p><strong>Price:</strong> ₹{item.price}</p>
        </div>
      ))}
    </div>
  );
}

export default OrderDetails;