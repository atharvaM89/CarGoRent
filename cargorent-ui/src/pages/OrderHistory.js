import { useEffect, useState } from "react";
import api from "../services/api";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const customerId = 1; // TEMP (JWT will replace later)

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/orders/customer/${customerId}`);
      setOrders(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load order history");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h2>My Orders</h2>

      {orders.length === 0 && <p>No orders found.</p>}

      {orders.map((order) => (
        <div
          key={order.orderId}
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            marginBottom: "12px",
          }}
        >
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default OrderHistory;